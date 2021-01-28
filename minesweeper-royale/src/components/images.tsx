import { Colors } from './consts';

export function Flag() {
  return (
    <img style={{ width: '2em', height: '1em' }} src={process.env.PUBLIC_URL + '/images/flag.png'} alt="..."/>
  );
}

export function SpaceIcon() {
  return <div style={{ display: 'inline-block', width: '1em', height: '1em', backgroundColor: Colors.LightGreen }} />
}
