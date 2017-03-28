import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VehicleType } from '../../../../../../core/models/vehicle-type';
import { FuelType } from '../../../../../../core/models/fuel-type';
import { Vehicle } from '../../../../../../core/models/vehicle';
import { EnumEx } from '../../../../../../core/models/EnumEx';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'

import { VehicleService } from '../../../../../../core/services/vehicle/vehicle.service';

@Component({
  templateUrl: './user-vehicle-detail.component.html',
  styleUrls: ['./user-vehicle-detail.component.sass']
})
export class UserVehicleDetailComponent implements OnInit {
  public vehicleForm: FormGroup;
  public index: string;
  public title: string;
  private vehicleTypes: any[];
  private fuelTypes: any[];

  private vehicles: Vehicle[] = [];
  errorMessage: string;

  private vehicle = new Vehicle();

  constructor(private fb: FormBuilder,   
              private router: Router,
              private route: ActivatedRoute,
              private _service: VehicleService) { 

       this.vehicleTypes = this.getVehicleTypes();
       this.fuelTypes = this.getFuelTypes();
      this.vehicleForm = fb.group({ //// Make Model driven form
            "name": [null, Validators.required],
            "brandName": [null, Validators.required],
            "modelName": [null, Validators.required],
            "description": [null],
            "vehiclPlateIdentifier": [null],
            "vehicleType": [null, Validators.required],
            "fuelType": [null, Validators.required],
            "fuelConsumption": [null]
        })
      
      
  }

    private sub: any;
   
  ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.index = params["id"];
        })
        if (this.index != "") { //// Based on id decide Title add/edit
            this.title = "Edit User Vehicle"
            this.getVehicleData();
        } else {
            this.title = "Add User Vehicle"
        }

  }

  getVehicleData() { 
    this._service.getAll().subscribe(
      vehicles => { this.vehicles = vehicles;
      this.vehicle = this.vehicles[this.index];
  },
      error => this.errorMessage = <any>error
    );
  }

  restrictNumeric(e, object){
    var input;
    if (e.metaKey || e.ctrlKey) {
        return true;
    }
    if (e.which === 32) {
        return false;
    }
    if (e.which === 0) {
        return true;
    }
    if (e.which < 33) {
        return true;
    }
    if (e.which === 46) {
        if(object.value != undefined && object.value != '')
        {
        if(object.value.indexOf('.') > 0)
            return false;
        else
            return true;
    }
    else
    return false;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  }


  getVehicleTypes() {
    let vehicleTypes: any[] = [];

    //Get name-value pairs from VehicleTypeEnum
    let vehicleTypeEnumList = EnumEx.getNamesAndValues(VehicleType);

    //Convert name-value pairs to VehicleType[]
    vehicleTypeEnumList.forEach(pair => {
        let vehicleType = { 'id': pair.value.toString(), 'name': pair.name };
        vehicleTypes.push(vehicleType);
    });
    return vehicleTypes;
}

 getFuelTypes() {
    let fuelTypes: any[] = [];

    //Get name-value pairs from VehicleTypeEnum
    let fuelTypeEnumList = EnumEx.getNamesAndValues(FuelType);

    //Convert name-value pairs to VehicleType[]
    fuelTypeEnumList.forEach(pair => {
        let fuelType = { 'id': pair.value.toString(), 'name': pair.name };
        fuelTypes.push(fuelType);
    });
    return fuelTypes;
}

save(form, isValid: boolean) {
          console.log(this.index);
          if(this.index == "")
            {
           this._service.insert(form)
                .then(form => this.vehicles.push(form),
                    error =>  this.errorMessage = <any>error);
            }
            else
            {
                this._service.update(form, this.index).then(res => true,
                error =>  this.errorMessage = <any>error);
            }
                
        this.router.navigate(["/smart-cities/user-vehicle/vehicles"]);
    }

}