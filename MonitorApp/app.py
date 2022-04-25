import argparse
import cv2

import numpy as np
import torch
import yolov5
from typing import Union, List, Optional

import norfair
from norfair import Detection, Tracker, Video, drawing

import time as T

import os




#from monitor import Monitor

from monitor import Monitor, Monitor_object

##Settings
max_distance_between_points: int = 200
detector_path = "yolov5m6.pt"
device = None
conf_threshold = 0.25
iou_threshold = 0.45
image_size = 720
classes = [0,1,2,3,5,7,16] 
#0 person 1 bicycle  2 car 3 motocycle 5 bus 7 truck   16 dog
track_points = "bbox"
speed_object = "car"
avg_speed_object_lenght = 4.5 #in meters
output_size = (1280, 720)
#margins of frame area where monitor becomes active prevents false detections on edges in x axel
monitor_margin = 200
#at what point objects are counted
counter_line = output_size[0]/2
#interval to send data
api_addr = "http://localhost:4000/traffic_data/live"
api_send_interval = 2
api_key = "test"




class YOLO:
    def __init__(self, model_path: str, device: Optional[str] = None):
        if device is not None and "cuda" in device and not torch.cuda.is_available():
            raise Exception(
                "Selected device='cuda', but cuda is not available to Pytorch."
            )
        # automatically set device if its None
        elif device is None:
            device = "cuda:0" if torch.cuda.is_available() else "cpu"
        # load model
        self.model = yolov5.load(model_path, device=device)

    def __call__(
        self,
        img: Union[str, np.ndarray],
        conf_threshold: float = 0.25,
        iou_threshold: float = 0.45,
        image_size: int = 720,
        classes: Optional[List[int]] = None
    ) -> torch.tensor:

        self.model.conf = conf_threshold
        self.model.iou = iou_threshold
        if classes is not None:
            self.model.classes = classes
        detections = self.model(img, size=image_size)
        return detections


def euclidean_distance(detection, tracked_object):
    return np.linalg.norm(detection.points - tracked_object.estimate)


def yolo_detections_to_norfair_detections(
    yolo_detections: torch.tensor,
    track_points: str = 'centroid'  # bbox or centroid
) -> List[Detection]:
    """convert detections_as_xywh to norfair detections
    """
    norfair_detections: List[Detection] = []

    if track_points == 'centroid':
        detections_as_xywh = yolo_detections.xywh[0]
        for detection_as_xywh in detections_as_xywh:
            centroid = np.array(
                [
                    detection_as_xywh[0].item(),
                    detection_as_xywh[1].item()
                ]
            )
            scores = np.array([detection_as_xywh[4].item()])
            norfair_detections.append(
                Detection(points=centroid, scores=scores)
            )
    elif track_points == 'bbox':
        detections_as_xyxy = yolo_detections.xyxy[0]
        names = yolo_detections.names
        for detection_as_xyxy in detections_as_xyxy:
            bbox = np.array(
                [
                    [detection_as_xyxy[0].item(), detection_as_xyxy[1].item()],
                    [detection_as_xyxy[2].item(), detection_as_xyxy[3].item()]
                ]
            )
            scores = np.array([detection_as_xyxy[4].item(), detection_as_xyxy[4].item()])
            norfair_detections.append(
                Detection(points=bbox, scores=scores, label = yolo_detections.names[int(detection_as_xyxy[5].item())]))
            

    return norfair_detections


def main():
    model = YOLO(detector_path, device)

    cap = cv2.VideoCapture(0)

    tracker = Tracker(
            distance_function=euclidean_distance,
            distance_threshold=max_distance_between_points)

    time = T.time()

    ret, frame = cap.read()
    width = int(frame.shape[1])
    monitor_margins = (monitor_margin, width - monitor_margin)

 
    monitor = Monitor(speed_object, avg_speed_object_lenght,monitor_margins, counter_line)

    monitor.star_sender(api_addr,api_send_interval, api_key)
    

    while True:

        time = T.time()
        ret, frame = cap.read()

        yolo_detections = model(frame, conf_threshold, iou_threshold, image_size, classes )
 
        detections = yolo_detections_to_norfair_detections(yolo_detections, track_points)
        
        tracked_objects = tracker.update(detections=detections)

        monitor.update(tracked_objects, time)

        if track_points == 'centroid':
            norfair.draw_points(frame, detections)
        elif track_points == 'bbox':
            norfair.draw_boxes(frame, detections)

        norfair.draw_tracked_objects(frame, tracked_objects)


        if cv2.waitKey(2) & 0xFF == ord('q'):
            monitor.stop_sender()
            break
        #cv2.imshow('test',frame)

        resized = cv2.resize(frame, output_size, interpolation = cv2.INTER_AREA)

        cv2.imshow('test',resized)


if __name__ == "__main__":
    main()


