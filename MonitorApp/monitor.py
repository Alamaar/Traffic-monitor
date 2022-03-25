import norfair
import numpy as np
import math





class Monitor_object():

    def __init__(self, id, class_name, position):
        self.life = 10
        self.id = id
        self.class_name = class_name
        self.position = position
        self.speeds = []
        self.direction = None


    def __eq__(self, other):

        if other == self.id:
            return True
        return False
       


    def newPosition(self, position):
        self.life = self.life + 1 
        speed = self.calculateSpeed(self.position, position)
        self.position = position

        ## Set direction
        ## 100, 300 ( x, y)
        ## -> <-
        #self.direction = 

        

        return speed


    def calculateSpeed(self, lastPosition, newPosition):
        #print("newPosition")
        #print(newPosition)
        #print("lastPosition")
        #print(lastPosition)
        speed = math.sqrt( ((lastPosition[0]-newPosition[0])**2)+((lastPosition[1]-newPosition[1])**2) )
        #print("Distance")
        #print(speed)
        return speed
        

        


    def kill(self):
        avgSpeed = sum(self.speeds)/ len(self.speeds)

        return avgSpeed







class Monitor():


    ## Lista[car_west[[1,50], [2,39]], car_east[]]

    ## flush --> 


    def __init__(self, framerate = 30, px_to_m = 0 ):
        self.monitored_objects = []
        self.framerate = framerate
        self.px_to_m = px_to_m
         ## frame -> H /framerate / (1000 * px_to_m)/framerate * 3600
        self.conversion = 1000 * px_to_m / 1/framerate * 3600

        self.finnished_objects = []



    

    def update(self, new_objects):

        ## -> is same id in monitored -> if not -> add new -> if is -> addnewposition, monitired -> reduce life, 
        ## 
        for obj in new_objects:
            if obj[0] in self.monitored_objects:
                index = self.monitored_objects.index(obj[0])
                #print("olemassa")
                speed = self.monitored_objects[index].newPosition(obj[2])
                ## get speed and add to list to return
                #print("Speed")
                #print(speed/self.px_to_m  * self.framerate * 3.6)


            else:
                self.monitored_objects.append(Monitor_object(obj[0],obj[1],obj[2])) ## uusi objecti

        for obj in self.monitored_objects:
            obj.life = obj.life - 1

            if obj.life == 0:
                ##tappamis logikka
                #avg_speed = obj.kill()

                # -> 
                # self.finished_objects.append
                self.monitored_objects.remove(obj)
                        


        #print(self.monitored_objects)
                
    

            



