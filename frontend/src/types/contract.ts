import contractABI from '../ChibbiCyrene.json'

export const CONTRACT_ABI = contractABI.abi

export interface NFTContractData {
  name: string
  symbol: string
  totalSupply: number
  remainingSupply: number
  mintPrice: string
  maxSupply: number
  mintingActive: boolean
}