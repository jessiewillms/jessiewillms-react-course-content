var React = require('react'); //includes + bundles react library
var ReactDOM = require('react-dom');

// get main router library
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation; // a MIXIN helps change URL

var History = ReactRouter.History;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');


var h = require('./helpers') //gets the helper.js file

/*
App
-- header, inventory, order are children of app
*/

var App = React.createClass({
		
	getInitialState : function() {
		return {
			fishes : {},
			order : {}
		}
	}, // populates itself
	addToOrder : function(key) {
		this.state.order[key] = this.state.order[key] + 1 || 1;
		this.setState({order : this.state.order});
	}, 
	addFish : function(fish) {
		var timestamp = (new Date()).getTime();

		this.state.fishes['fish-' + timestamp] = fish;
		// set the state

		this.setState({ fishes : this.state.fishes });
	},

	loadSamples : function() {
		this.setState({
			fishes : require('./sample-fishes')
		});
	},

	renderFish : function(key) {
		return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
	},

 	render : function() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh seafood good"/>
					<ul className="list-of-fishes">
						{Obec.keys(this.state.fishes).map(this.renderFish)}
					</ul>
				</div>
				<Order fishes={this.state.fishes} order={this.state.order} />
				<Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
			</div>
		)
	}

})

/*
Fish
<Fish/>
*/

 var Fish = React.createClass({
 	onButtonClick : function() {
 		var key = this.props.index;
 		console.log('Going to add the fish : ', key);
 		this.props.addToOrder(key)
 	},

 	render : function() {
 		var details = this.props.details;
 		var isAvailable = (details.status === 'available' ? true : false);
 		var buttonText = (isAvailable ? 'Add to order' : 'Sold out!')
 		return (
 			<li className="menu-fish">
 				<img src={details.image} alt={details.name}/>
 				<h3 className="fish-name">
 				{details.name} 
 				<span className="price">{h.formatPrice(details.price)}</span>
 				</h3>
 				<p>{details.desc}</p>
 				<button disables={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
 			</li>
 		)
 	}
 });

/*Add fish form
<AddFishForm/>
*/

var AddFishForm = React.createClass({
		createFish : function(event) {
			// 1. stop form
			event.preventDefault(); 

			// 2. take data + create an object
			var fish = {
				name : this.refs.name.value,
				price : this.refs.price.value,
				status : this.refs.status.value,
				desc : this.refs.desc.value,
				image :this.refs.image.value
			}

			console.log(fish)

			// 3. add fish to App State
			this.props.addFish(fish);
			this.refs.fishForm.reset();
		},

		render : function() {

		return (
			<form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
				<input type="text" ref="name" placeholder="Fish name"/>
				<input type="text" ref="price" placeholder="Fish Price"/>

				<select ref="status">
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold out!</option>
				</select>

				<textarea type="text" ref="desc" placeholder="Desc"></textarea>
				<input type="text" ref="image" placeholder="URL to image"/>

				<button type="Submit">+ add item</button>
			</form>
		)
	}
});



/*
Header
<Header/>
*/

var Header = React.createClass({
	render : function() {

		return (
			<header className="top">
					<h1>Catch 
					<span className="ofThe">
						<span className="of">of</span>
						<span className="the">the</span>
					</span>
					day</h1>
				<h3 className='tagline'><span>{this.props.tagline}</span></h3>
			</header>
		)
	}
})


/*
Order
<Order/>
*/

var Order = React.createClass({
	render : function() {
	return (
		<div className="order-wrap">
		<h2 className={order-title}>Your order</h2>
		<ul className=order>
			
		</ul>
		)
	}
})


/*
Inventory
<Inventory/>
*/

var Inventory = React.createClass({
	render : function() {
	return (
			<div>
				<h2>Inventory</h2>

				<AddFishForm {...this.props} /> {/* passes all props down */}
				<button onClick={this.props.loadSamples}>Load sample fish</button>
			</div>
		)
	}
})



/*
StorePicker: let us make <StorePicker/>
*/


var StorePicker = React.createClass({
	
	mixins : [History],

	goToStore : function(event) {
		event.preventDefault();
		// get data from input

		var storeId = this.refs.storeId.value; // ref="storeId", allows to refence input
		this.history.pushState(null, '/store/' + storeId); //pushState changes URL without # or refresh page


		// transition from <StorePicker/> to <App/> (what's being passed), change URL bar
	},
    // render: what HTML to display
    render: function() {
  
        return ( 
        	<form className="store-selector" onSubmit={this.goToStore}>	
        		{/* creates the class */}
        		<h2>Please enter a store</h2>
        		<input type="text" ref="storeId" defaultValue={h.getFunName()} required />
        		<input type="Submit" />
        	</form>
        )
    }
});


/*
Not found
*/


var NotFound = React.createClass({
	render : function() {
		return <h1>Not found!</h1>
	}
})


/*
Routes
*/

var routes = (
	<Router history={createBrowserHistory()}>
		<Route path="/" component={StorePicker}/>
		<Route path="/store/:storeId" component={App}/> 
		<Route path="*" component={NotFound}/> 
	</Router>
)
// storeId = a varibale that is used to change URL


ReactDOM.render(routes, document.querySelector('#main'))