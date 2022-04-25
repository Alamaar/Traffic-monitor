import threading
import norfair
import numpy as np
import math
import requests
import json
from datetime import datetime


class Monitor_object():

    def __init__(self, id, class_name, position, timestamp):
        self.life = 10
        self.id = id
        self.class_name = class_name
        self.positions = []
        self.positions.append(position)
        self.speeds = []
        self.direction = None
        self.times = []
        self.times.append(timestamp)
        self.lenght_calculated = False

    def __eq__(self, other):

        if other == self.id:
            return True
        return False
       
                                              
    def newPosition(self, position, timestamp):   
        self.life = self.life + 1                 
        self.times.append(timestamp) 
        self.positions.append(position)                                                                                                     

        if self.direction == None:
            self.direction = self.set_direction(self.positions[-2],self.positions[-1])
            

    def set_direction(self, old_position, new_position):
        direction = (new_position[0]- old_position[0])

        if direction < 0:
            return "West"

        elif direction > 0:
            return "East"  


    def calculateSpeed(self, lastPosition, newPosition):
        distance = math.sqrt( ((lastPosition[0]-newPosition[0])**2)+((lastPosition[1]-newPosition[1])**2) )
        speed = distance / ((self.times[-1] - self.times[-2]))
        self.speeds.append(speed)
        return speed
        
    def kill(self):
        distance = math.sqrt( ((self.positions[0][0]-self.positions[-1][0])**2)+((self.positions[0][1]-self.positions[-1][1])**2) )
        avgSpeed = distance / ((self.times[-1] - self.times[0]))

        return avgSpeed





class Monitor():


    def __init__(self, speed_object, object_avg_lenght , margins, counterLine):
        self.monitored_objects = []
        self.finnished_objects = []
        self.margins = margins
        self.avg_lenght = object_avg_lenght
        self.speed_object = speed_object

        self.avg_w = []
        self.avg_e = []

        self.avg_set = False

        self.finished_objects = []

        self.counterLine = counterLine


    def update(self, tracked_objects, timestamp):


        for obj in tracked_objects:
             if obj.estimate[obj.live_points].any():
                 position = norfair.centroid(obj.estimate[obj.live_points])

                 if position[0] > self.margins[0] or position[0] < self.margins[1]: # x cooridinate

                    id = obj.id
                    class_name = obj.last_detection.label

                    if id in self.monitored_objects:

                        index = self.monitored_objects.index(id)

                        monitor_obj = self.monitored_objects[index]
               
                        monitor_obj.newPosition(position, timestamp = timestamp)

                        if monitor_obj.class_name == self.speed_object:
                            
                            if self.avg_set == False:
                                if monitor_obj.lenght_calculated == False:
                                    if monitor_obj.direction != None:
                                        points = obj.last_detection.points
                                        measurements = abs(points[0][0] - points[1][0])
                                        
                                        if monitor_obj.direction == "West":
                                            self.avg_w.append(measurements/self.avg_lenght)
                                            
                                        if monitor_obj.direction == "East":
                                            self.avg_e.append(measurements/self.avg_lenght)

                                        if len(self.avg_e) > 100 and len(self.avg_w) > 100:
                                            self.avg_set = True

                                        
                                        monitor_obj.lenght_calculated = True

                    else:
                        self.monitored_objects.append(Monitor_object(id,class_name,position, timestamp)) ## new object

        
        
        

        for obj in self.monitored_objects:
            obj.life = obj.life - 1

            if obj.life == 0:
                self.killObject(obj, timestamp)
                
                        
    def killObject(self,obj,timestamp):
        ##When objects trackin is done the object is killed and speeds calculated and then passed to finnished objects array
        if obj.direction != None:
            if self.passed_counterLine(obj.positions):
                isoTimestamp = datetime.fromtimestamp(timestamp).replace(microsecond=0).isoformat()
            
                if obj.class_name == self.speed_object:
                    
                    avg_speed = obj.kill()
                    if obj.direction == "West":
                        
                        avg = ((avg_speed/(sum(self.avg_w)/len(self.avg_w)))*3.6)
                    if obj.direction == "East":
                        
                        avg = ((avg_speed/(sum(self.avg_e)/len(self.avg_e)))*3.6)


                    newEntry = {
                        "className" : obj.class_name,
                        "obj_number" : obj.id,
                        "speed" : avg,
                        "direction" : obj.direction,
                        "time" : isoTimestamp
                    }
                    
                    print(newEntry)
                    self.finished_objects.append(newEntry)

                else:

                    newEntry = {
                            "className" : obj.class_name,
                            "obj_number" : obj.id,
                            "direction" : obj.direction,
                            "time" : isoTimestamp
                        }

                    self.finished_objects.append(newEntry)
                    print(newEntry)
 
        self.monitored_objects.remove(obj)


    def passed_counterLine(self,positions):

        for i, position in enumerate(positions):
            try:
                if position[0] > self.counterLine:
                    if positions[i-1][0] < self.counterLine or  positions[i+1][0] > self.counterLine:
                        return True,
            except:
                print(position) 
            
            finally:
                pass
        return False

        

    def flush(self):
        copy = self.finished_objects.copy()
        self.finished_objects.clear()
        return copy

    

            
    def star_sender(self, url, interval=60, api_key = "dev"):
        self.url = url
        self.exit = threading.Event()
        self.api_key = api_key

        thread = threading.Thread(target=self.run_sender, args=(interval,))
        thread.start()

    def stop_sender(self):

        self.exit.set()


    def run_sender(self,interval):
        while not self.exit.is_set():
            
            temp = self.flush()
            if bool(temp):
                temp = { 'data' : temp,
                        'api_key' : self.api_key}
                json_object = json.dumps(temp, indent = 4) 
                if (json_object == {}):
                    continue
                resp = requests.post(self.url, json = temp )

                              
                if resp.status_code != 201:
                    print("Sender error")
                    print(resp.text)


            self.exit.wait(interval)

        self.exit.clear()

