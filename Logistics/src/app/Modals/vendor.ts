export interface VendorRegistaionForm {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
}
export interface Vendor {
  _id: string;

  name: string;
  email: string;
password?:string;
  contactNumber: string;

  gstNumber?: string;
  gstImage?: string; // URL of the GST image
  address?: string;
  aadhaarImage?: string; // URL of Aadhaar image
  profilePic?: string; // URL of profile picture
  approved:boolean,
  aadhaarNumber:number // Auto-generated timestamp
}


export interface VendorUpdate {
  _id?: string;
  name: string;
  email: string;
  contactNumber: string;
  gstNumber?: string;
  gstImage?: File;
  address?: string;
  aadhaarImage?: File;
  password: string;
  profilePic?: File;
  aadhaarNumber:number
}


export interface VendorResponse{

    meessag: string;
    data: Vendor[];

}

export interface VendorResponseUpdate {
  message: string;  // Corrected the typo
  data: Vendor;
}

