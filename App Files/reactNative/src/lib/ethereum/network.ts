export enum Networks {
  homestead = 'homestead'
}

export const getNetwork = (): Networks => {
  //return (process.env.NODE_ENV === 'production') ? Networks.homestead : Networks.ropsten
  return Networks.homestead
}