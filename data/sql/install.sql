INSERT INTO `hd0`.`Service` (`company`, `type`, `location`, `username`, `password`, `namespace`) 
	VALUES ('Zenatek S.P.A.', 'OTRS', 'http://localhost/otrs/nph-genericinterface.pl/Webservice/GenericTicketConnector', 'hd0', 'hd0', 'http://www.otrs.org/TicketConnector/');

INSERT INTO `hd0`.`Queue` (`id`, `service_id`, `order`, `name`, `code`)
	VALUES	(NULL, '1', '0', 'EasyPOP', '5'),
		(NULL, '1', '1', 'ContPV', '3');

INSERT INTO `hd0`.`User` (`id`, `name`, `email`, `password`, `username`)
	VALUES	(NULL, 'Fabio', 'fmfazio@gmail.com', 123, 'fabio'),
		(NULL, NULL, 'stefano', 123, 'stefano'),
		(NULL, 'Mario Rossi', 'fabio.fazio@zenatek.it', 123, 'mario');
