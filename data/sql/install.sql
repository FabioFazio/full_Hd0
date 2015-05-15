-- Remember to set as <<[client] default-character-set   = utf8>>
-- in /etc/mysql/my.cnf or foreign characters will be corrupted to db

INSERT INTO `hd0`.`Service` (`company`, `type`, `location`, `username`, `password`, `namespace`) 
	VALUES ('Zenatek S.P.A.', 'OTRS', 'http://localhost/otrs/nph-genericinterface.pl/Webservice/GenericTicketConnector', 'hd0', 'hd0', 'http://www.otrs.org/TicketConnector/');
	

INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	VALUES	(NULL, 'q05ar', NULL, 'Da quale dispositivo hai acceduto al servizio?',
			NULL);

INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05ar1',
		'PC', 'Che browser hai utilizzato per accedere al servizio?',
		id FROM `hd0`.`Filter` WHERE code = 'q05ar';
INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05ar2',
		'Terminale', 'In che momento si è riscontrato il problema?',
		id FROM `hd0`.`Filter` WHERE code = 'q05ar';
INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05ar3',
		'Smartphone',
		'Che modello di smarphone hai utilizzato per accedere al servizio?',
		id FROM `hd0`.`Filter` WHERE code = 'q05ar';
INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05ar4',
		'Altro',
		'Nono sono supportati altri dispositivi per questo applicativo!',
		id FROM `hd0`.`Filter` WHERE code = 'q05ar';
INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05ar5',
		'Non ricordo',
		NULL,
		id FROM `hd0`.`Filter` WHERE code = 'q05ar';		
		
INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05a1r1',
		'Internet Explorer', NULL,
		id FROM `hd0`.`Filter` WHERE code = 'q05ar1';
INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05a1r2',
		'Firefox', NULL,
		id FROM `hd0`.`Filter` WHERE code = 'q05ar1';
INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05a1r3',
		'Chrome', NULL,
		id FROM `hd0`.`Filter` WHERE code = 'q05ar1';
INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05a1r4',
		'Altro', NULL,
		id FROM `hd0`.`Filter` WHERE code = 'q05ar1';

INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05a4r1',
		'Accesso al servizio', NULL,
		id FROM `hd0`.`Filter` WHERE code = 'q05ar2';
INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05a4r2',
		'Gestione delle utenze', NULL,
		id FROM `hd0`.`Filter` WHERE code = 'q05ar2';
INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05a4r3',
		'Finalizzazione di una stampa', NULL,
		id FROM `hd0`.`Filter` WHERE code = 'q05ar2';
INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05a4r4',
		'Altro', NULL,
		id FROM `hd0`.`Filter` WHERE code = 'q05ar2';		
		
INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05a3r1',
		'Android', NULL,
		id FROM `hd0`.`Filter` WHERE code = 'q05ar3';
INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05a3r2',
		'IPhone', NULL,
		id FROM `hd0`.`Filter` WHERE code = 'q05ar3';
INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05a3r3',
		'Windows Mobile', NULL,
		id FROM `hd0`.`Filter` WHERE code = 'q05ar3';
INSERT INTO `hd0`.`Filter` (`id`, `code`, `responce`, `question`, `askedBy_id`)
	SELECT NULL, 'q05a3r4',
		'Altro', NULL,
		id FROM `hd0`.`Filter` WHERE code = 'q05ar3';

		
		
INSERT INTO `hd0`.`Queue` (`id`, `service_id`, `order`, `name`, `code`, `filter_id`)
	SELECT NULL, '1', '0', 'EasyPOP', '5',
		id FROM `hd0`.`Filter` WHERE code = 'q05ar';
INSERT INTO `hd0`.`Queue` (`id`, `service_id`, `order`, `name`, `code`, `filter_id`)
	VALUES	(NULL, '1', '1', 'ContPV', '3', null);
		

INSERT INTO `hd0`.`User` (`id`, `name`, `email`, `password`, `username`)
	VALUES	(NULL, 'Fabio', 'fmfazio@gmail.com', 123, 'fabio'),
		(NULL, NULL, 'stefano', 123, 'stefano'),
		(NULL, 'Mario Rossi', 'fabio.fazio@zenatek.it', 123, 'mario');
