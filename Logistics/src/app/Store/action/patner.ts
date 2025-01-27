import { Patner } from "../../Modals/Partner";



export class getAllPatner{
  static readonly type = '[Patner] Get';
}

export class updateStatusPatner{
  static readonly type = '[Patner] updateStatusPatner';
  constructor(public payload:Patner,public _id:string){}
}


  export class selectedPatner{
 static readonly type = '[Patner] Set'
 constructor(public _id:string){}
  }
