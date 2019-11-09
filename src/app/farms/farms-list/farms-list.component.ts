import { Component, OnInit, Input } from '@angular/core';
import { CropService } from 'src/app/crops/crops.service';
import { Crop } from 'src/app/crops/crops-data.model';
import { FarmService } from '../farm.service';
import { Farm } from '../farm-data.model';


@Component({
  selector: 'app-farms-list',
  templateUrl: './farms-list.component.html',
  styleUrls: ['./farms-list.component.css']
})
export class FarmsListComponent implements OnInit {
  @Input() farmerId: string;
  cropsList: Crop[];
  farmsList: Farm[];
  constructor(private cropService: CropService, private farmService: FarmService) {}

  ngOnInit() {
   // this.cropsList = this.cropService.getCurrCropsList().crops;
   this.farmService.getAllFarms();
   this.farmService.getFarmsListUpdateListener().subscribe(farmsList => {
      this.farmsList = farmsList.farms;
      console.log(this.farmsList);
   });
  }
  onAddFarm() {
    console.log('add farm clicked');
  }

}
