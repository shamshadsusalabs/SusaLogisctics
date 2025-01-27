// driver.interface.ts

export interface Driver {
  [key: string]: any;
  _id: string;
  name: string;
  contactNumber: string;
  aadhaarCard: string;
  licenseNumber: string;
  driverNumber: string;
  address: string;
  profilePic: string;
  licenseImage: string;
  aadhaarImage: string;
  approved:boolean,
  refreshToken: string | null;
}


export interface DriverResponse {

  meessag: string;
  data: Driver[];
}
