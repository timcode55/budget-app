class Budget {
	constructor(budget) {
		this.budget = Number(budget);
		this.budgetLeft = this.budget;
	}

	subtractFromBudget(amount) {
		return (this.budgetLeft -= amount);
	}
}

class HTML {
	insertBudget(amount) {
		//Insert
		budgetTotal.innerHTML = '$ ' + `${amount}`;
		budgetLeft.innerHTML = 'Remaining Budget - $' + `${amount}`;
	}

	printMessage(message, className) {
		var messageWrapper = document.createElement('div');
		messageWrapper.classList.add('text-center', 'alert', className);
		messageWrapper.appendChild(document.createTextNode(message));

		//insert into HTML
		document.querySelector('.add').insertBefore(messageWrapper, addExpenseForm);

		// Clear the Error
		setTimeout(function() {
			document.querySelector('.add .alert').remove();
		}, 1000);
	}

	addExpenseToList(name, amount) {
		var li = document.createElement('li');
		li.className = 'list-group-item d-flex justify-content-between align-items-center remove';
		var liAmount = amount;
		li.innerHTML = `
                        ${name}
                        <span class="badge badge-primary item__delete item">$ ${liAmount}<button class="item__delete--btn"><i onclick="removeFromList(this,${liAmount})" class="ion-ios-close-outline delete"></i></button></span>
                        
                    `;
		expenseList.appendChild(li);
	}

	//subtract from amount
	trackBudget(amount) {
		var budgetLeftDollars = budget.subtractFromBudget(amount);
		budgetLeft.innerHTML = 'Remaining Budget - $' + `${budgetLeftDollars}`;

		var totalExpenses = userBudget - budgetLeftDollars;
		document.querySelector('.budget__expenses--value').innerHTML = '$ ' + totalExpenses;

		var expensePercentage = totalExpenses / userBudget;
		var round = Math.round(expensePercentage * 100);
		document.querySelector('.budget__expenses--percentage').innerHTML = round + '%';

		if (budgetLeftDollars <= 0) {
			budgetLeft.classList.add('budget__full');
		} else {
			budgetLeft.classList.remove('budget__full');
		}
	}
}

var addExpenseForm = document.querySelector('.add__container'),
	budgetTotal = document.querySelector('.budget__income--value'),
	budgetLeft = document.querySelector('.budget__value');
totalExpenses = document.querySelector('.budget__expenses--value');

var budget;
var userBudget;
var html = new HTML();

var expenseList = document.querySelector('.expenses__list');

function removeFromList(element, amount) {
	element.parentElement.parentElement.parentElement.remove();
	html.trackBudget(-1 * amount);
}

eventListeners();
function eventListeners() {
	document.addEventListener('DOMContentLoaded', function() {
		// Ask the Vistor the monthly budget
		userBudget = prompt(" What's your total income for this month? ");
		// Validate the user budget
		if (userBudget === null || userBudget === '' || userBudget === '0') {
			window.location.reload();
		} else {
			//budget is valid then instantiate the budget class
			budget = new Budget(userBudget);

			//Instantiate HTML Class
			html.insertBudget(budget.budget);
		}
	});

	document.querySelector('.add__btn').addEventListener('click', function(e) {
		e.preventDefault();

		var expenseName = document.querySelector('.add__description').value;
		var amount = document.querySelector('.add__value').value;

		if (expenseName.length && amount.length) {
			html.addExpenseToList(expenseName, amount);
			html.trackBudget(amount);
		}
		if (expenseName === '' || amount === '') {
			html.printMessage('All the fields are required!');
		}
	});

	document.addEventListener('keypress', function(event) {
		if (event.keyCode === 13 || event.which === 13) {
			var expenseName = document.querySelector('.add__description').value;
			var amount = document.querySelector('.add__value').value;
			var focus = document.querySelector('.add__description').focus();

			function setFocusToTextBox() {
				var textbox = document.querySelector('.add__description');
				textbox.focus();
			}

			if (expenseName.length && amount.length) {
				html.addExpenseToList(expenseName, parseInt(amount));
				html.trackBudget(amount);
			}

			if (expenseName === '' || amount === '') {
				html.printMessage('All the fields are required!');
			}
		}
	});

	document.addEventListener('keypress', function(event) {
		if (event.keyCode === 13 || event.which === 13) {
			document.querySelector('.add__description').value = '';
			document.querySelector('.add__value').value = '';
		}
	});
	document.querySelector('.add__btn').addEventListener('click', function(e) {
		document.querySelector('.add__description').value = '';
		document.querySelector('.add__value').value = '';
	});
}
