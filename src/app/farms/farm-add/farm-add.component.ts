import { Component, OnInit, Output, EventEmitter, AfterViewInit, } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FarmService } from '../farm.service';
import { Crop } from 'src/app/crops/crops-data.model';
import { CropService } from 'src/app/crops/crops.service';
import { } from 'googlemaps';
declare const google: any;

@Component({
  selector: 'app-farm-add',
  templateUrl: './farm-add.component.html',
  styleUrls: ['./farm-add.component.css']
})
export class FarmAddComponent implements OnInit, AfterViewInit {
  cropsList: Crop[];
  lat = 20.5937;
  lng = 78.9629;
  farmCoords: { lat: number, lng: number }[] = [];
  farmCoordsTrunc: { lat: string, lng: string }[] = [];
  farmArea: number;
  cropsListLoaded = false;
  private mode = 'add';
  form: FormGroup;
  drawingManager: any;
  selectedShape: any;

  @Output() farmAdded = new EventEmitter();
  constructor(private farmService: FarmService, private cropService: CropService) { }

  ngAfterViewInit() {

  }
  ngOnInit() {
    this.cropService.getCropsList();
    this.cropService.getCropsListUpdateListener().subscribe((cropsData: { crops: Crop[] }) => {
      this.cropsListLoaded = true;
      this.cropsList = cropsData.crops;
      console.log(this.cropsList);
    });
    this.form = new FormGroup({
      cropType: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null)
    });
  }
  onFarmAdd() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'add') {
      // tslint:disable-next-line: prefer-const
      let postBody = this.form.value;
      postBody.polygonPoints = {
        type: 'Polygon',
        coordinates: this.farmCoords.map(farm => {
          return [
            farm.lat,
            farm.lng
          ];
        })
      };
      console.log(this.form.value);
      this.farmService.addFarm(postBody);
    } else {
      //  this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset();
    this.farmAdded.emit('added');
  }

  onFarmAddCancel() {
    this.farmAdded.emit('cancel');
  }

  // maps handle

  onMapReady(map) {
    this.initDrawingManager(map);
  }

  deleteSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.farmCoords = [];
      this.farmCoordsTrunc = [];
      // To show:
      this.drawingManager.setOptions({
        drawingControl: true
      });
    }
  }
  clearSelection() {
    if (this.selectedShape) {
      this.selectedShape.setEditable(false);
      this.selectedShape = null;
      this.farmCoords = [];
      this.farmCoordsTrunc = [];
    }
  }
  setSelection(shape) {
    this.clearSelection();
    this.selectedShape = shape;
    shape.setEditable(true);
  }


  initDrawingManager(map: any) {
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ['polygon']
      },
      polygonOptions: {
        draggable: true,
        editable: true
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON
    };
    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        console.log('if1');
        this.farmCoords = [];
        this.farmCoordsTrunc = [];
        const len = event.overlay.getPath().getLength();
        for (let i = 0; i < len; i++) {
          this.farmCoords.push(event.overlay.getPath().getAt(i).toJSON());
        }
        this.farmCoordsTrunc = this.farmCoords.map(farm => {
          return {
            lat: farm.lat.toPrecision(5),
            lng: farm.lng.toPrecision(5)
          };
        });
        this.farmArea = google.maps.geometry.spherical.computeArea(event.overlay.getPath());
        // console.log("center", event.overlay.getBounds().getCenter())
        // console.log('area = ', area);
      }
      if (event.type !== google.maps.drawing.OverlayType.MARKER) {
        console.log('if2');
        // Switch back to non-drawing mode after drawing a shape.
        this.drawingManager.setDrawingMode(null);
        // To hide:
        this.drawingManager.setOptions({
          drawingControl: false
        });
        // Add an event listener that selects the newly-drawn shape when the user
        // mouses down on it.
        const newShape = event.overlay;
        newShape.type = event.type;
        google.maps.event.addListener(newShape, 'click', () => {
          this.setSelection(newShape);
        });
        this.setSelection(newShape);
      }
    });
    google.maps.event.addListener(this.drawingManager, 'drawingmode_changed', this.clearSelection);
  }


}
