# Traffic monitor

## Info
This project takes live feed from webcam and calculates how many of different means of tranportation goes across the webcam feed. 
From theese are taken time, direction(west, east) and from cars also speed is estimated.

The detections are fed to server and in server data is parsed and compressed to 10 minute interval chunks
Eq: 10 cars went west in 10 minute time frame


## How

Frameworks and libarys

MonitorApp
```
-PyTorch
-Yolo5 - model detection
-NorFair - object tracking
```
WebApp
```
-Express - backend
-React - frontend
````

