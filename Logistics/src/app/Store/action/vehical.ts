



export class getAllVehical {
  static readonly type = '[Vehicle] Get All Vehicles';
}

export class getVehicalByVendorId {
  static readonly type = '[Vehicle] Get Vehicle ByVendor ID';
  constructor(public id: string) {} // ID as a parameter
}
