export default interface AlertDetails {
  details: string
  createdAt: Date | string
  local: { name: string; details: string }
  user: null | { name: string }
}
