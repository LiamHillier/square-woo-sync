/**
 * External dependencies
 */
import { HashRouter, Routes, Route } from 'react-router-dom';

/**
 * Internal dependencies
 */
import Layout from './components/layout';
import routes from './routes';

const App = () => {
	return (
		<HashRouter>
			<Layout>
				<Routes>
					{ routes.map( ( route, index ) => (
						<Route
							key={ index }
							path={ route.path }
							element={ <route.element /> }
						/>
					) ) }
				</Routes>
			</Layout>
		</HashRouter>
	);
};

export default App;
