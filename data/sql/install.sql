INSERT INTO `hd0`.`Service` (`company`, `type`, `location`, `username`, `password`, `namespace`) 
	VALUES ('Zenatek S.P.A.', 'OTRS', 'http://ztac.zenatek.eu/otrs/nph-genericinterface.pl/Webservice/GenericTicketConnector', 'fabio.fazio', 'aaAA11!!', 'http://www.otrs.org/TicketConnector/');

INSERT INTO `hd0`.`Queue` (`id`, `service_id`, `order`, `name`, `code`)
	VALUES (NULL, '1', '0', 'ZTAC Incoming Queue', '5'),
		(NULL, '1', '1', 'Junk', '3');

INSERT INTO `hd0`.`User` (`id`, `name`, `email`, `password`, `username`)
	VALUES (NULL, 'Fabio', 'fmfazio@gmail.com', 123, 'fabio');
