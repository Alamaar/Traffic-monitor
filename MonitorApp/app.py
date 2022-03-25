import argparse

import numpy as np
import torch
import yolov5
from typing import Union, List, Optional

import norfair
from norfair import Detection, Tracker, Video, drawing

#from monitor import Monitor

#import monitor


max_distance_between_points: int = 200


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


    if track_points == "test":
        print(yolo_detections.xyxy[0])
        for detection in enumerate(yolo_detections.pred):
            print(detection)


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


detector_path = "yolov5m6.pt"
device = None
conf_threshold = 0.25
iou_threshold = 0.45
image_size = 720
classes = [0,1,2,3,5,7,16]
track_points = "bbox"

names =  ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
        'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
        'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
        'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
        'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
        'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
        'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 
        'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 
        'teddy bear', 'hair drier', 'toothbrush']


#""" 0 person 1 bicycle  2 car 3 motocycle 5 bus 7 truck   16 dog       """


def main():
    model = YOLO(detector_path, device)


    video = Video(input_path="./TestVideos/Video1.mp4")


    tracker = Tracker(
            distance_function=euclidean_distance,
            distance_threshold=max_distance_between_points)

    #monitor = Monitor()
    



#""" 0 person 1 bicycle  2 car 3 motocycle 5 bus 7 truck   16 dog       """
    for frame in video:

    

        yolo_detections = model(frame, conf_threshold, iou_threshold, image_size, classes )

        
        detections = yolo_detections_to_norfair_detections(yolo_detections, track_points)
        
        tracked_objects = tracker.update(detections=detections)

        #print(tracked_objects)

        




      

        for obj in tracked_objects:
            print(obj)

            if obj.last_detection.label == "car":
                if obj.estimate[obj.live_points].any():
                    position = drawing.centroid(obj.estimate[obj.live_points])

                    if position[0] > 100 or position[0] < 1800: # x cooridinate
                        #append to list obj.id, positon
                        pass
                        

                        



        if track_points == 'centroid':
            norfair.draw_points(frame, detections)
        elif track_points == 'bbox':
            norfair.draw_boxes(frame, detections)

        norfair.draw_tracked_objects(frame, tracked_objects)

        video.show(frame)


if __name__ == "__main__":
    main()


