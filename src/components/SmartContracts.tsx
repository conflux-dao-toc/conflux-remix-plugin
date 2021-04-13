import React from 'react';
import { Alert, Accordion, Button, Card, Form, InputGroup } from 'react-bootstrap';
import copy from 'copy-to-clipboard';
import { CSSTransition } from 'react-transition-group';
import { AbiInput, AbiItem } from 'web3-utils';
import { Conflux } from 'js-conflux-sdk';
import { InterfaceContract } from './Types';
import Method from './Method';
import './animation.css';

const EMPTYLIST = 'Currently you have no contract instances to interact with.';

const confluxPortal: any = (window as { [key: string]: any }).conflux;

interface InterfaceDrawMethodProps {
	conflux: Conflux;
	network: string;
	busy: boolean;
	setBusy: (state: boolean) => void;
	abi: AbiItem;
	address: string;
	updateBalance: (address: string) => void;
}

const DrawMethod: React.FunctionComponent<InterfaceDrawMethodProps> = (props) => {
	const [error, setError] = React.useState<string>('');
	const [success, setSuccess] = React.useState<string>('');
	const [value, setValue] = React.useState<string>('');
	const [args, setArgs] = React.useState<{ [key: string]: string }>({});
	const { conflux, busy, network, setBusy, abi, address, updateBalance } = props;

	React.useEffect(() => {
		const temp: { [key: string]: string } = {};
		abi.inputs?.forEach((element: AbiInput) => {
			temp[element.name] = '';
		});
		setArgs(temp);
	}, [abi.inputs]);

	function buttonVariant(stateMutability: string | undefined): string {
		switch (stateMutability) {
			case 'view':
			case 'pure':
				return 'primary';
			case 'nonpayable':
				return 'warning';
			case 'payable':
				return 'danger';
			default:
				break;
		}
		return '';
	}

	return (
		<>
			<Method
				abi={abi}
				setArgs={(name: string, value2: string) => {
					args[name] = value2;
				}}
			/>
			<Alert variant="danger" onClose={() => setError('')} dismissible hidden={error === ''}>
				<small>{error}</small>
			</Alert>
			<Alert variant="success" onClose={() => setSuccess('')} dismissible hidden={success === ''}>
				<small>{success}</small>
			</Alert>
			<InputGroup className="mb-3">
				<InputGroup.Prepend>
					<Button
						variant={buttonVariant(abi.stateMutability)}
						block
						size="sm"
						disabled={busy || !conflux}
						onClick={async () => {
							setBusy(true);
							const parms: any[] = [];
							abi.inputs?.forEach((item: AbiInput) => {
								parms.push(args[item.name]);
							});
							conflux.provider = confluxPortal;
							const newContract = conflux.Contract({
								abi: JSON.parse(JSON.stringify([abi])),
								address,
							});
							const accounts = await confluxPortal.enable();
							// console.log(abi.name);
							// console.log(newContract);
							let txReceipt: any;
							if (abi.stateMutability === 'view' || abi.stateMutability === 'pure') {
								try {
									if (parms.length > 0) {
										txReceipt = abi.name ? await newContract[`${abi.name}`](parms).call({ from: accounts[0] }) : null;
									} else {
										txReceipt = abi.name ? await newContract[`${abi.name}`]().call({ from: accounts[0] }) : null;
									}
									if (typeof txReceipt === 'object') {
										setSuccess(JSON.stringify(txReceipt, null, 4));
									} else {
										setValue(txReceipt);
									}
									// TODO: LOG
								} catch (e) {
									// console.error(error)
									setError(e.message ? e.message : e.toString());
								}
							} else {
								try {
									if (parms.length > 0) {
										txReceipt = abi.name
											? await conflux.sendTransaction({
													from: accounts[0],
													to: address,
													data: newContract[`${abi.name}`](parms).data,
											  })
											: null;
									} else {
										txReceipt = abi.name
											? await conflux.sendTransaction({
													from: accounts[0],
													to: address,
													data: newContract[`${abi.name}`]().data,
											  })
											: null;
									}
									// console.log(txReceipt)
									setError('');
									setSuccess(JSON.stringify(txReceipt, null, 2));
									updateBalance(accounts[0]);
									// TODO: LOG
								} catch (e) {
									// console.error(error)
									setError(e.message ? e.message : e.toString());
								}
							}
							setBusy(false);
						}}
					>
						<small>{abi.stateMutability === 'view' || abi.stateMutability === 'pure' ? 'call' : 'transact'}</small>
					</Button>
					<Button
						variant={buttonVariant(abi.stateMutability)}
						size="sm"
						className="mt-0 pt-0 float-right"
						onClick={() => {
							if (abi.name) {
								try {
									const parms: string[] = [];
									abi.inputs?.forEach((item: AbiInput) => {
										if (args[item.name]) {
											parms.push(args[item.name]);
										}
									});
									const newContract = conflux.Contract({ abi: [abi], address });
									copy(newContract[`${abi.name}`](...parms).data);
								} catch (e) {
									console.log(e.toString());
								}
							}
						}}
					>
						<i className="far fa-copy" />
					</Button>
				</InputGroup.Prepend>
				<Form.Control
					value={value}
					size="sm"
					readOnly
					hidden={!(abi.stateMutability === 'view' || abi.stateMutability === 'pure')}
				/>
			</InputGroup>
		</>
	);
};

const ContractCard: React.FunctionComponent<{
	conflux: Conflux;
	network: string;
	busy: boolean;
	setBusy: (state: boolean) => void;
	contract: InterfaceContract;
	index: number;
	remove: () => void;
	updateBalance: (address: string) => void;
}> = ({ conflux, network, busy, setBusy, contract, index, remove, updateBalance }) => {
	const [enable, setEnable] = React.useState<boolean>(true);

	function getCFXNetworkUrl(networkName: string) {
		let cfxscanurl = 'https://confluxscan.io';
		if (networkName === 'Testnet') {
			cfxscanurl = 'https://testnet.confluxscan.io';
		}
		return cfxscanurl;
	}

	function DrawMathods() {
		const list = contract.abi ? contract.abi : [];
		const items = list.map((abi: AbiItem, id: number) => (
			<Accordion key={`Methods_${index.toString()}_${id.toString()}`}>
				<Card>
					<Accordion.Toggle as={Card.Header} eventKey={`Methods_${id}`} className="p-1">
						<small>{abi.name}</small>
					</Accordion.Toggle>
					<Accordion.Collapse eventKey={`Methods_${id}`}>
						<Card.Body className="py-1 px-2">
							<DrawMethod
								conflux={conflux}
								network={network}
								busy={busy}
								setBusy={setBusy}
								abi={abi}
								address={contract.address}
								updateBalance={updateBalance}
							/>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
		));
		return <>{items}</>;
	}

	return (
		<CSSTransition in={enable} timeout={300} classNames="zoom" unmountOnExit onExited={remove}>
			<Card className="mb-2">
				<Card.Header className="px-2 py-1">
					<strong className="align-middle">{contract.name}</strong>
					&nbsp;
					<small className="align-middle">{`${contract.address.substring(0, 6)}...${contract.address.substring(
						38
					)}`}</small>
					<Button
						className="float-right align-middle"
						size="sm"
						variant="link"
						onClick={() => {
							window.open(`${getCFXNetworkUrl(network)}/address/${contract.address}`);
						}}
					>
						<i className="fas fa-external-link-alt" />
					</Button>
					<Button
						className="float-right align-middle"
						size="sm"
						variant="link"
						onClick={() => {
							setEnable(false);
						}}
					>
						<i className="fas fa-trash-alt" />
					</Button>
				</Card.Header>
				{DrawMathods()}
			</Card>
		</CSSTransition>
	);
};

interface InterfaceSmartContractsProps {
	conflux: Conflux;
	network: string;
	busy: boolean;
	setBusy: (state: boolean) => void;
	contracts: InterfaceContract[];
	updateBalance: (address: string) => void;
}

const SmartContracts: React.FunctionComponent<InterfaceSmartContractsProps> = ({
	conflux,
	network,
	busy,
	setBusy,
	contracts,
	updateBalance,
}) => {
	const [error, setError] = React.useState<string>('');
	const [count, setCount] = React.useState<number>(0);

	React.useEffect(() => {
		setCount(0);
		setError(EMPTYLIST);
	}, [contracts, busy]);

	function DrawContracts() {
		const items = contracts.map((data: InterfaceContract, index: number) => (
			<ContractCard
				conflux={conflux}
				network={network}
				busy={busy}
				setBusy={setBusy}
				contract={data}
				index={index}
				remove={() => {
					setCount(count + 1);
					setError(EMPTYLIST);
				}}
				updateBalance={updateBalance}
				key={`Contract_${index.toString()}`}
			/>
		));
		return <>{items}</>;
	}

	return (
		<div className="SmartContracts">
			<Alert variant="warning" className="text-center" hidden={contracts.length !== count}>
				<small>{error}</small>
			</Alert>
			{DrawContracts()}
		</div>
	);
};

export default SmartContracts;
