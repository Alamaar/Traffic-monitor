import threading
import requests
import json
import time


class Sender():

    running =  False
    dataToSend = dict

    exit = threading.Event()



    def __init__(self, interval = 60 , clear_data = True, data = dict) -> None:
        
        self.interval = interval
        self.clear_data = clear_data
        self.data = data

    
    def updateData(self, data):
        

        pass

    def run(self):

        while not self.exit_is_set():
            json_object = json.dumps(self.data, indent = 4) 

            resp = requests.post(self.url, json = json_object)

            if resp.status_code != 201:
                print("Sender error")
                print(resp.text)

            if self.clear_data:
                self.data.clear()

            self.exit.wait(self.interval)

        exit.clear()
            
    def start(self):

        thread = threading.Thread(target=self.run)
        thread.start()
        


    def stop(self):
        self.exit.set()


    