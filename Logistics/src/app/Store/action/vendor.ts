import { Vendor } from "../../Modals/vendor";


export class getAllVendor{
  static readonly type = '[Vendor] Get';
}

export class updateStatusVendor{
  static readonly type = '[Vendor] updateStatusVendor';
  constructor(public payload:Vendor,public _id:string){}
}


  export class selectedVendor{
 static readonly type = '[Vendor] Set'
 constructor(public _id:string){}
  }
