import './Home.scss';
import PrimaryCanvas from '../components/PrimaryCanvas/PrimaryCanvas';
import SideBar from '../components/SideBar/SideBar';
function Home() {
  return (
    <section id="home-page">
      <SideBar />
      <PrimaryCanvas />
    </section>
  );
}

export default Home;