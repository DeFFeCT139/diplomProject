import MainPageAtt from './mainPage/mainPage';

export default async function Homed({params}) {
  const {id} = await params
  return <MainPageAtt id={id}/>;
}