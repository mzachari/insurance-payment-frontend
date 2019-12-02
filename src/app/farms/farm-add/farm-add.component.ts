import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  NgZone
} from "@angular/core";

import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from "@angular/forms";
import { FarmService } from "../farm.service";
import { Crop } from "src/app/crops/crops-data.model";
import { CropService } from "src/app/crops/crops.service";
import {} from "googlemaps";
import { MapsAPILoader } from "@agm/core";
import { Farm } from "../farm-data.model";
declare const google: any;

@Component({
  selector: "app-farm-add",
  templateUrl: "./farm-add.component.html",
  styleUrls: ["./farm-add.component.css"]
})
export class FarmAddComponent implements OnInit, AfterViewInit {
  cropsList: Crop[];
  lat = 20.5937;
  lng = 78.9629;
  farmCoords: { lat: number; lng: number }[] = [];
  farmCoordsTrunc: { lat: string; lng: string }[] = [];
  farmArea = 0;
  cropsListLoaded = false;
  private mode = "add";
  uniqueValidatorIcon = "error";
  form: FormGroup;
  drawingManager: any;
  selectedShape: any;
  farmsList: Farm[] = [];

  @Output() farmAdded = new EventEmitter();

  constructor(
    private farmService: FarmService,
    private cropService: CropService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {}
  ngOnInit() {
    this.cropService.getCropsList();
    this.cropService
      .getCropsListUpdateListener()
      .subscribe((cropsData: { crops: Crop[] }) => {
        this.cropsListLoaded = true;
        this.cropsList = cropsData.crops;
        console.log(this.cropsList);
      });
    this.farmService.getAllFarms();
    this.farmService.getFarmsListUpdateListener().subscribe(farmsList => {
      this.farmsList = farmsList.farms;
    });
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      cropType: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null),
      startDate: new FormControl(null),
      endDate: new FormControl(null)
    });
    this.setCurrentPosition();
  }

  onNameChanged(event: Event) {
    const name = (event.target as HTMLInputElement).value;
    const isNameUnique = this.farmsList
      .map(farm => farm.name)
      .some(value => value === name);
    if (isNameUnique) {
      this.uniqueValidatorIcon = "error";
      this.form.controls['name'].setErrors({'notUnique': true});
    } else {
      this.uniqueValidatorIcon = "check_circle";
    }
  }

  onFarmAdd() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === "add") {
      // tslint:disable-next-line: prefer-const
      let postBody = this.form.value;
      postBody.area = this.farmArea;
      postBody.polygonPoints = {
        type: "Polygon",
        coordinates: this.farmCoords.map(farm => {
          return [farm.lat, farm.lng];
        })
      };
      console.log(postBody);
      this.farmService.addFarm(postBody);
    } else {
      //  this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset();
    this.farmAdded.emit("added");
  }

  onFarmAddCancel() {
    this.farmAdded.emit("cancel");
  }

  // maps handle

  onMapReady(map) {
    this.initDrawingManager(map);
  }

  deleteSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.farmArea = 0;
      this.farmCoords = [];
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
        drawingModes: ["polygon"]
      },
      polygonOptions: {
        draggable: true,
        editable: true
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON
    };
    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);
    google.maps.event.addListener(
      this.drawingManager,
      "overlaycomplete",
      event => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const paths = event.overlay.getPaths();
          for (let p = 0; p < paths.getLength(); p++) {
            google.maps.event.addListener(paths.getAt(p), "set_at", function() {
              if (!event.overlay.drag) {
                console.log("triggered 1!");
                this.farmCoords = [];
                const len = event.overlay.getPath().getLength();
                for (let i = 0; i < len; i++) {
                  this.farmCoords.push(
                    event.overlay
                      .getPath()
                      .getAt(i)
                      .toJSON()
                  );
                }
                this.farmArea = google.maps.geometry.spherical.computeArea(
                  event.overlay.getPath()
                );
                console.log(this.farmCoords, this.farmArea);
              }
            });
            google.maps.event.addListener(
              paths.getAt(p),
              "insert_at",
              function() {
                console.log("triggered 2!");
                this.farmCoords = [];
                const len = event.overlay.getPath().getLength();
                for (let i = 0; i < len; i++) {
                  this.farmCoords.push(
                    event.overlay
                      .getPath()
                      .getAt(i)
                      .toJSON()
                  );
                }
                this.farmArea = google.maps.geometry.spherical.computeArea(
                  event.overlay.getPath()
                );
                console.log(this.farmCoords, this.farmArea);
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              "remove_at",
              function() {
                console.log("triggered 3!");
                this.farmCoords = [];
                const len = event.overlay.getPath().getLength();
                for (let i = 0; i < len; i++) {
                  this.farmCoords.push(
                    event.overlay
                      .getPath()
                      .getAt(i)
                      .toJSON()
                  );
                }
                this.farmArea = google.maps.geometry.spherical.computeArea(
                  event.overlay.getPath()
                );
                console.log(this.farmCoords, this.farmArea);
              }
            );
          }
          console.log("if1");
          this.farmCoords = [];
          const len = event.overlay.getPath().getLength();
          for (let i = 0; i < len; i++) {
            this.farmCoords.push(
              event.overlay
                .getPath()
                .getAt(i)
                .toJSON()
            );
          }
          this.farmArea = google.maps.geometry.spherical.computeArea(
            event.overlay.getPath()
          );
          console.log(this.farmCoords, this.farmArea);
        }
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          console.log("if2");
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
          google.maps.event.addListener(newShape, "click", () => {
            this.setSelection(newShape);
          });
          this.setSelection(newShape);
        }
      }
    );
  }
  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }
}
