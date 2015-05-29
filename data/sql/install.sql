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
		'Non ricordo / Non saprei',
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
		

INSERT INTO `hd0`.`User` (`id`, `name`, `email`, `password`, `username`, `administrator`)
	VALUES	(NULL, 'Fabio', 'fmfazio@gmail.com', 123, 'fabio', 0),
		(NULL, 'Mario Rossi', 'fabio.fazio@zenatek.it', 123, 'mario', 0),
		(NULL, 'Focal Point', 'f.fazio@zenatek.it', 123, 'tizio', 0),
		(NULL, 'Marco Rossi', 'marco', 123, 'marco', 0),
		(NULL, 'Amministratore', 'admin@zenatek.it', 123, 'admin', 1);

		
INSERT INTO `Store` (`id`, `manager_id`, `code`, `name`, `address`)
	SELECT	NULL, u.id, 'Busnago', 'Busnago', 'Via Italia 197 20874 Busnago (MB)'
		FROM User as u WHERE u.username ='fabio';
	
INSERT INTO `Store` (`id`, `manager_id`, `code`, `name`, `address`)	
	VALUES	(NULL, NULL, 'Brembate', 'Brembate', 'Strada Provinciale 184 24041 Brembate (BG)');
	
	
INSERT INTO `Department`(`id`, `manager_id`, `store_id`, `code`, `name`)
	SELECT	NULL, NULL, s.id, 'Busnago-Scatolame', 'Scatolame'
		FROM Store as s WHERE s.name ='Busnago';

	
INSERT INTO `Sector`(`id`, `manager_id`, `department_id`, `code`, `name`)
	SELECT	NULL, NULL, d.id, 'Busnago-Scatolame-Liquidi', 'Liquidi'
		FROM Store as s join Department as d on d.store_id = s.id
			WHERE s.name ='Busnago' and d.name = 'Scatolame';

INSERT INTO `Sector`(`id`, `manager_id`, `department_id`, `code`, `name`)
	SELECT	NULL, NULL, d.id, 'Busnago-Scatolame-Profumeria', 'Profumeria'
		FROM Store as s join Department as d on d.store_id = s.id
			WHERE s.name ='Busnago' and d.name = 'Scatolame';
	
INSERT INTO `Sector`(`id`, `manager_id`, `department_id`, `code`, `name`)
	SELECT	NULL, NULL, d.id, 'Busnago-Scatolame-Detergenti', 'Detergenti'
		FROM Store as s join Department as d on d.store_id = s.id
			WHERE s.name ='Busnago' and d.name = 'Scatolame';
			

INSERT INTO `UserGroup`(`id`, `sector_id`, `code`, `name`)
	SELECT NULL, sr.id, 'Busnago-Scatolame-Liquidi', 'Busnago-Scatolame-Liquidi'
		FROM Store st join Department d on d.store_id = st.id join
			Sector sr on sr.department_id = d.id
		WHERE st.name ='Busnago' and d.name = 'Scatolame' and sr.name = 'Liquidi';

INSERT INTO `UserGroup`(`id`, `sector_id`, `code`, `name`)
	SELECT NULL, sr.id, 'Busnago-Scatolame-Profumeria', 'Busnago-Scatolame-Profumeria'
		FROM Store st join Department d on d.store_id = st.id join
			Sector sr on sr.department_id = d.id
		WHERE st.name ='Busnago' and d.name = 'Scatolame' and sr.name = 'Profumeria';
		
INSERT INTO `UserGroup`(`id`, `sector_id`, `code`, `name`)
	SELECT NULL, NULL, 'Focalpoint-5', 'Focalpoint-5';


INSERT INTO `GroupGrant`(`id`, `name`, `focalpoint`)
	VALUES	(NULL,'Focalpoint-5', 1),
		(NULL,'Busnago-Scatolame-Profumeria', 0),
		(NULL,'Busnago-Scatolame-Liquidi', 0);
	
		
INSERT INTO `group_grant`(`group_id`, `grant_id`)
	SELECT gp.id, gt.id
		FROM `hd0`.`UserGroup` gp, `hd0`.`GroupGrant` gt
		WHERE gp.code ='Focalpoint-5' and gt.name = 'Focalpoint-5';
	
INSERT INTO `group_grant`(`group_id`, `grant_id`)
	SELECT gp.id, gt.id
		FROM `hd0`.`UserGroup` gp, `hd0`.`GroupGrant` gt
		WHERE gp.code ='Busnago-Scatolame-Liquidi' and gt.name = 'Busnago-Scatolame-Liquidi';

INSERT INTO `group_grant`(`group_id`, `grant_id`)
	SELECT gp.id, gt.id
		FROM `hd0`.`UserGroup` gp, `hd0`.`GroupGrant` gt
		WHERE gp.code ='Busnago-Scatolame-Profumeria' and gt.name = 'Busnago-Scatolame-Profumeria';
		

INSERT INTO `user_group`(`user_id`, `group_id`)
	SELECT u.id, g.id
		FROM User u, `hd0`.`UserGroup` g
		WHERE u.username ='fabio' and g.code = 'Busnago-Scatolame-Profumeria';

INSERT INTO `user_group`(`user_id`, `group_id`)
	SELECT u.id, g.id
		FROM User u, `hd0`.`UserGroup` g
		WHERE u.username ='mario' and g.code = 'Busnago-Scatolame-Liquidi';

INSERT INTO `user_group`(`user_id`, `group_id`)
	SELECT u.id, g.id
		FROM User u, `hd0`.`UserGroup` g
		WHERE u.username ='tizio' and g.code = 'Focalpoint-5';
		

INSERT INTO `grant_queue`(`grant_id`, `queue_id`)
	SELECT gt.id, q.id
		FROM `hd0`.`GroupGrant` gt, Queue q
		WHERE gt.name ='Focalpoint-5' and q.name = 'EasyPOP';

INSERT INTO `grant_queue`(`grant_id`, `queue_id`)
	SELECT gt.id, q.id
		FROM `hd0`.`GroupGrant` gt, Queue q
		WHERE gt.name ='Busnago-Scatolame-Liquidi' and (q.name = 'EasyPOP' || q.name = 'ContPV');

INSERT INTO `grant_queue`(`grant_id`, `queue_id`)
	SELECT gt.id, q.id
		FROM `hd0`.`GroupGrant` gt, Queue q
		WHERE gt.name ='Busnago-Scatolame-Profumeria' and q.name = 'ContPV';


INSERT INTO `hd0`.`Announcement` (`id`, `author_id`, `message`, `lastchange`, `warning`, `broadcast`)
	VALUES	(NULL, '1', 'Busnago Scatolame Liquidi message', NOW(), 0, NULL),
		(NULL, '1', 'Broadcast message', NOW(), '1', '1');
		
INSERT INTO  `hd0`.`announcement_sector` ( `announcement_id` , `sector_id`)
	VALUES	( '1',  '1' );
	
SELECT 'Database properly populted!';
