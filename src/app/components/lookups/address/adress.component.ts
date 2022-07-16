import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressData } from 'src/app/models/AddressData';
import { AddressService } from 'src/app/services/address.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-adress',
  templateUrl: './adress.component.html',
  styleUrls: ['./adress.component.css']
})
export class AdressComponent implements OnInit {
  isCollapsed: boolean = false;
  AddressDataList: AddressData[] = [];
  AddressDataedit: any;
  currentEditableAddressData: any;


  //#region  CTOR
  constructor(private addressService: AddressService, private fb: FormBuilder) { }
  //#endregion

  //#region  OnInt
  ngOnInit(): void {

    //#region  Retrieve Data 
    this.addressService.getAll().subscribe((res: any) => {
      this.AddressDataList = res as AddressData[];
    });
    //#endregion



  }
  //#endregion

  //#region FormAdd
  AddressDataAddForm: FormGroup = this.fb.group({
    addressName: ['', [Validators.required]],
  });
  get AddressName() {
    return this.AddressDataAddForm.get('addressName');
  }
 
  //#endregion

  //#region  FormEdit
  AddressDataFormEdit: FormGroup = this.fb.group({
    addressCode: '',
    addressName: ['', [Validators.required]],
    isEdit: false,
  });
  get AddressIdEdit() {
    return this.AddressDataFormEdit.get('id');
  }
  get AddressNameEdit() {
    return this.AddressDataFormEdit.get('addressName');
  }
  //#endregion


  //#region  insertRecord
  insertRecord() {
 
    var objectSend: AddressData = {
      ...this.AddressDataAddForm.value
    }


    this.addressService.create(objectSend).subscribe(
      (res: any) => {
        if (!res['save']) {

          if (res['nameDublicate']) {
            swal.fire("This Address Name Already Exist", '', 'error');
          }

        }
        else {
          this.AddressDataList.push(res['data'] as AddressData);
          swal.fire("Save Successfully.", "", "success");
          this.AddressDataAddForm.reset();
        }
      } );

  }
  //#endregion


  //#region  editItem
  editItem(address: AddressData) {
    const found = this.AddressDataList.find(element => element.isEdit === true);

    if (found) {
      let i = this.AddressDataList.indexOf(found)
      found.isEdit = false
      this.AddressDataList[i] = { ...found };
    }
    this.AddressDataedit = address as AddressData;
    let index = this.AddressDataList.indexOf(address);
    address.isEdit = true;
    // Pass Data
    this.AddressIdEdit?.setValue(address.id);
    this.AddressNameEdit?.setValue(address.addressName);


    // Update Data
    this.AddressIdEdit?.updateValueAndValidity();
    this.AddressNameEdit?.updateValueAndValidity();

  }
  //#endregion


  //#region  saveEditItem
  saveEditItem(address: AddressData) {

    let index = this.AddressDataList.indexOf(address);

    address.isEdit = false;
   
    this.addressService.update(address.id, this.AddressDataFormEdit.value)
      .subscribe((res:any) => {
        if (res['update']) {
          swal.fire("Edited Successfully.");
          this.AddressDataList[index].addressName = this.AddressNameEdit?.value;
        } else {
          if (res['notFound']) {
            let msg = "Sorr,Can`t found this Address.";
            swal.fire(msg, "", "error");
          }
        }
      })

  }
  //#endregion

  //#region cancelEdit
  cancelEdit() {
    let index = this.AddressDataList.indexOf(this.AddressDataedit);
    this.currentEditableAddressData = this.AddressDataedit
    this.currentEditableAddressData.isEdit = false;
    this.AddressDataList[index] = { ...this.AddressDataedit };
  }
  //#endregion
  //#region onDelete
  onDelete(item : AddressData) {

    swal.fire({
      title: 'Are you sure you want to delete this Address ?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete It!'
    }).then((result) => {
      this.addressService.delete(item.id)
        .subscribe((res:any) => {
          if (res['delete']) {
            let index = this.AddressDataList.indexOf(item);
            swal.fire("Deleted Successfully.", "", "success");
            this.AddressDataList.splice(index, 1)
          } else {
            let msg = "Undelete You must delete this Address from: \n";
            if (res['checkPersons'])
              msg += "• Persons\n";
            if (res['notFound'])
              msg = "Sorr,Can`t found this Address.";
            swal.fire(msg, "", "error");
          }
        } )
    })
  }
  //#endregion
}
