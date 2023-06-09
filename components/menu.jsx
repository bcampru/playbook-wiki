import Nav from "react-bootstrap/Nav";
import React, { useState, useEffect, use } from "react";
import {
	Col,
	Collapse,
	Row,
	Modal,
	Button,
	Form,
	InputGroup,
	DropdownButton,
	Dropdown,
} from "react-bootstrap";
import { PlusSquareFill, Book, People } from "react-bootstrap-icons";

export default function Menu() {
	const [newWorkflowName, setNewWorkflowName] = useState("");
	const [customers, setCustomers] = useState([]);
	const [newCustomerName, setNewCustomerName] = useState("");
	const [creator, setCreator] = useState(false);
	const [filterClient, setFilterClient] = useState(false);
	const [filter, setFilter] = useState("");
	const [data, setData] = useState([]);

	const fetchCustomers = () => {
		fetch("/api/customers").then((res) => {
			if (res.ok) {
				res.json().then((d) => {
					setData(d);
					setCustomers(d);
				});
			}
		});
	};

	useEffect(() => {
		fetchCustomers();
	}, []);

	useEffect(() => {
		if (filter == "") {
			setCustomers(
				data.map((c) => ({
					...c,
					isCollapsed: false,
				}))
			);
			return;
		}
		if (filterClient) {
			setCustomers(
				data.filter((customer) =>
					customer.name.toLowerCase().includes(filter.toLowerCase())
				)
			);
		} else {
			let aux = JSON.parse(JSON.stringify(data));
			setCustomers(
				aux
					.map((customer) => {
						let w = customer.workflows.filter((workflow) =>
							workflow.name
								.toLowerCase()
								.includes(filter.toLowerCase())
						);
						if (w.length > 0) {
							customer.workflows = w;
							customer.isCollapsed = true;
							return customer;
						}
					})
					.filter((customer) => customer != undefined)
			);
		}
	}, [data, filter]);

	const createCustomer = () => {
		if (!newCustomerName) {
			alert("Please enter a name!");
			return;
		}
		setCreator(false);
		fetch("/api/customers", {
			method: "POST",
			body: JSON.stringify({
				name: newCustomerName,
			}),
		}).then((res) => {
			if (res.ok) {
				fetchCustomers();
				alert("Customer created");
			} else {
				alert("Error when creating customer");
			}
		});
	};

	const changeCollapse = (customer) => {
		setCustomers((prevCustomers) =>
			prevCustomers.map((c) =>
				c.name === customer.name
					? {
							...c,
							isCollapsed: !c.isCollapsed,
					  }
					: c
			)
		);
	};
	const changeEditor = (customer) => {
		setCustomers((prevCustomers) =>
			prevCustomers.map((c) =>
				c.name === customer.name
					? {
							...c,
							isEditting: !c.isEditting,
					  }
					: c
			)
		);
	};

	const createWorkflow = (customer) => {
		if (!newWorkflowName) {
			alert("Please enter a name!");
			return;
		}
		changeEditor(customer);
		fetch("/api/workflow", {
			method: "POST",
			body: JSON.stringify({
				workflow: newWorkflowName,
				client: customer.name,
			}),
		}).then((res) => {
			if (res.ok) {
				fetchCustomers();
				alert("Workflow created");
			} else {
				alert("Error when creating workflow");
			}
		});
	};

	const deleteCustomer = (customer) => {
		const confirmed = window.confirm(
			`Are you sure you want to delete customer ${customer.name} and all of his workflows?`
		);
		if (!confirmed) return;
		changeEditor(customer);
		fetch(`/api/customers?client=${customer.name}`, {
			method: "DELETE",
		}).then((res) => {
			if (res.ok) {
				fetchCustomers();
				alert("Customer deleted");
			} else {
				alert("Error when deleting customer");
			}
		});
	};
	return (
		<>
			<Row className="align-items-center">
				<Col>
					<h3 style={{ marginBottom: "0rem" }}>Customers</h3>
				</Col>
				<Col md={3} xl={0} xs={12}>
					<PlusSquareFill
						style={{ cursor: "pointer" }}
						onClick={() => setCreator(true)}
					/>
					<Modal show={creator} onHide={() => setCreator(false)}>
						<Modal.Header closeButton>
							<Modal.Title>Add Client</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form.Label>Customer Name</Form.Label>
							<Form.Control
								value={newCustomerName}
								onChange={(e) =>
									setNewCustomerName(e.target.value)
								}
							/>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="primary" onClick={createCustomer}>
								Create Customer
							</Button>
						</Modal.Footer>
					</Modal>
				</Col>
			</Row>
			<hr />
			<Nav className="flex-column">
				<Nav.Item>
					<InputGroup className="mb-3">
						<DropdownButton
							variant="outline-secondary"
							title={
								<>
									{filterClient ? (
										<People
											style={{ marginBottom: "3px" }}
										/>
									) : (
										<Book style={{ marginBottom: "3px" }} />
									)}{" "}
									&nbsp;
								</>
							}
							id="input-group-dropdown-1"
						>
							<Dropdown.Item
								onClick={() => setFilterClient(false)}
							>
								<Book style={{ marginBottom: "3px" }} /> &nbsp;
								Workflows
							</Dropdown.Item>
							<Dropdown.Item
								onClick={() => setFilterClient(true)}
							>
								<People style={{ marginBottom: "3px" }} />{" "}
								&nbsp; Clients
							</Dropdown.Item>
						</DropdownButton>
						<Form.Control
							onChange={(e) => setFilter(e.target.value)}
						/>
					</InputGroup>
				</Nav.Item>
				{customers.map((customer) => (
					<>
						<Row>
							<Col>
								<Nav.Link
									onClick={() => changeCollapse(customer)}
								>
									<b>{customer.name}</b>
								</Nav.Link>
							</Col>
							<Col md={3} xl={0} xs={12}>
								<Nav.Link>
									<PlusSquareFill
										onClick={() => changeEditor(customer)}
									/>
								</Nav.Link>
							</Col>
						</Row>
						{customer.workflows.map((workflow) => (
							<Collapse in={customer.isCollapsed}>
								<div>
									<Nav.Link
										href={`/workflow/${customer.name}/${workflow.file}`}
									>
										{workflow.name}
									</Nav.Link>
								</div>
							</Collapse>
						))}
						<Modal
							show={customer.isEditting}
							onHide={() => changeEditor(customer)}
						>
							<Modal.Header closeButton>
								<Modal.Title>
									Customer {customer.name} Settings
								</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Form.Label>Workflow Name</Form.Label>
								<Form.Control
									value={newWorkflowName}
									placeholder="Workflow Name"
									onChange={(e) =>
										setNewWorkflowName(e.target.value)
									}
								/>
							</Modal.Body>
							<Modal.Footer>
								<Button
									variant="primary"
									onClick={() => createWorkflow(customer)}
								>
									Create Workflow
								</Button>
							</Modal.Footer>
						</Modal>
					</>
				))}
			</Nav>
		</>
	);
}
