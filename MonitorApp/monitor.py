import norfair

from typing import List


class Monitor_object():

    def __init__(self, id, position):
        self.life = 10
        self.id = id
        self.position = position
        self.speeds = []
        self.direction = (0.0 , 0.0)


    def newPosition(self, position):
        pass
        
        self.calculateSpeed(self.position, position)
        self.position = position


    def calculateSpeed(self, lastPosition, newPosition):
        pass


    def kill(self):
        avgSpeed = sum(self.speeds)/ len(self.speeds)

        return avgSpeed







class Monitor():


    def __init__(self):
        pass




    vehicles = List(Vehicle)


    def update(objects):

        for obj in objects:
            pass

            



