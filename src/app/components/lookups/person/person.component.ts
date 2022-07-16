import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressData } from 'src/app/models/AddressData';
import { PersonData } from 'src/app/models/PersonData';
import { AddressService } from 'src/app/services/address.service';
import { PersonService } from 'src/app/services/person.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  closeResult: string = "";
  isCollapsed:boolean=false;
  currentEdit: boolean=false;
  DataEdit: any;
  DataList: PersonData[] = [];
  AddressList: AddressData[] = [];
  
  //#region  CTOR
  constructor(private addressService: AddressService, private personService: PersonService,
    private modalService: NgbModal) { }
  //#endregion
  //#region OnInit
  ngOnInit(): void {

    
    //#region  Retrieve Data 
    this.personService.getAll().subscribe((res: any) => {
      this.DataList = res as PersonData[];
    });
    //#endregion

    //#region  Retrieve Data 
    this.addressService.getAll().subscribe((res: any) => {
      this.AddressList = res as AddressData[];
    });
    //#endregion
  }
  //#endregion

  //#region FormGroup Add
  formAdd = new FormGroup({
    id: new FormControl(''),
    personName: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required]),
    addressId: new FormControl('', [Validators.required]),
  });

  get Id() {
    return this.formAdd.get('id');
  }
  get PersonName() {
    return this.formAdd.get('personName');
  }
  get Age() {
    return this.formAdd.get('age');
  }
  get AddressId() {
    return this.formAdd.get('addressId');
  }
  //#endregion

  //#region  ResetFormAdd
  ResetFormAdd() {
    this.formAdd.reset();
    this.PersonName?.setValue('');
    this.Age?.setValue('');
    this.AddressId?.setValue('');

  }
  //#endregion
  //#region  onSubmit
  onSubmit() {
    debugger;
    if (this.formAdd.invalid) {
      this.formAdd.markAllAsTouched();
      return;
    }

    if (!this.currentEdit) {

      let data = {
        ...this.formAdd.value
      };
      this.Id?.setValue(null);
      this.personService.create(data).
        subscribe((res: any) => {
          if (res['save']) {
            this.DataList.push(res['data']);
            this.modalService.dismissAll();
            Swal.fire("Save success.", "", "success");
          } else {
            let msg = '';
            if (res['duplicat']) {
              msg += "Sorry,This item was added before";
              Swal.fire(msg, "", "error");

            }
          }
        });
    } else {


      let data = {
       ...this.formAdd.value,
       id : this.DataEdit.id
      };
      this.personService.update(data.id, data).
        subscribe((res: any) => {
          if (res['update']) {
            var index = this.DataList.findIndex(c => c.id == data.id);
            console.log( res['data']);
            this.DataList[index] = res['data'] as PersonData;
            this.modalService.dismissAll();
            Swal.fire("Update success.", "", "success");
          } else {
            let msg = '';
            if (res['duplicat'])
              msg = "Sorry,This item was added before";
            if (res['notFound'])
              msg = "Sorr,Can`t found this item.";
            Swal.fire(msg, "", "error");
          }
        });
    }
  }
  //#endregion

  //#region  Open Popup
  open(content : any) {
    this.modalService.open(content, { size: "lg", backdrop: 'static' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  //#endregion

  //#region  AddNew
  AddNew(content: any) {
    this.currentEdit = false;
    this.ResetFormAdd();
    this.open(content);
  }
  //#endregion

  //#region Close
  Close() {
    this.ResetFormAdd();
    this.modalService.dismissAll();
  }
  //#endregion

  //#region onDelete
  onDelete(item: PersonData) {

    Swal.fire({
      title: 'Are you sure you want to delete this Person ?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete It!'
    }).then((result) => {
      this.personService.delete(item.id)
        .subscribe((res: any) => {
          if (res['delete']) {
            let index = this.DataList.indexOf(item);
            Swal.fire("Deleted Successfully.", "", "success");
            this.DataList.splice(index, 1)
          } else {
            let msg = '';
            if (res['notFound'])
              msg = "Sorr,Can`t found this item.";
            Swal.fire(msg, "", "error");
          }
        })
    })
  }
  //#endregion

  //#region  editItem(item,content)
  editItem(item : PersonData, content : any) {
    this.currentEdit = true;
    this.DataEdit = item;
    this.Id?.setValue(this.DataEdit.id);
    this.PersonName?.setValue(this.DataEdit.personName);
    this.Age?.setValue(this.DataEdit.age);
    this.AddressId?.setValue(this.DataEdit.addressId);
    this.open(content);
  }
  //#endregion
}
