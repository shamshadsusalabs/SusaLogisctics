import { Driver } from "../../Modals/driver";

export class getAllDriver{
  static readonly type = '[Driver] Get';
}

export class updateStatusDriver{
  static readonly type = '[Driver] updateStatusDriver';
  constructor(public payload:Driver,public _id:string){}
}
  export class selectedDriver{
 static readonly type = '[Driver] Set'
 constructor(public _id:string){}
  }
