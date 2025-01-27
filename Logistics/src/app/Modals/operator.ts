export interface OperatorLogin {
  email: string;
  password: string;
}
export interface OperatorRegistaionForm {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
}
export interface Operator {
  _id: string; // MongoDB ObjectId (automatically generated by Mongoose)
  name: string;
  contactNumber: string;
  email: string;
  adharCard?: string; // Optional
  operatorNumber?: string;
  approved:boolean, // Optional
}

export interface OperatorResponse{

    meessag: string;
    data: Operator[];

}
