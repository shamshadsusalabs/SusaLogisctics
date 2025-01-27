import { Operator } from "../../Modals/operator";



export class getAllOperator{
  static readonly type = '[Operator] Get';
}

export class updateStatusOperator{
  static readonly type = '[Operator] updateStatusOperator';
  constructor(public payload:Operator,public _id:string){}
}


  export class selectedOperator{
 static readonly type = '[Operator] Set'
 constructor(public _id:string){}
  }
