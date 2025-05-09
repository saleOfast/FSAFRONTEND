export default function IF({condition, children}: any) {
  if(condition) return children;
  return null
}
