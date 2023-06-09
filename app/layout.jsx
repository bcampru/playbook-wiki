"use client";
import { Col, Container, Row, SSRProvider } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "../components/menu";

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.webp" />
				<title>Cyberproof - Workflows</title>
			</head>
			<body>
				<SSRProvider>
					<br />
					<Container fluid>
						<Row className="flex-xl-nowrap">
							<Col md={3} xl={2} xs={12}>
								<Menu></Menu>
							</Col>
							<Col>{children}</Col>
						</Row>
					</Container>
				</SSRProvider>
			</body>
		</html>
	);
}
