import NavigationBar from '../components/navbar';
import List from '../components/list';
import data from '../data/data.json';
function Home() {
    return (   
    <>
        <NavigationBar />
        <div className="container">
            <List  data={data}/>
        </div>
    </>
    );
}
export default Home;