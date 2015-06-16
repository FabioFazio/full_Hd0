-- Remember to set as <<[client] default-character-set   = utf8>>
-- in /etc/mysql/my.cnf or foreign characters will be corrupted to db

INSERT INTO `hd0`.`Service` (`company`, `type`, `location`, `username`, `password`, `namespace`) 
	VALUES ('Zenatek S.P.A.', 'OTRS', 'http://localhost/otrs/nph-genericinterface.pl/Webservice/GenericTicketConnector', 'hd0', 'hd0', 'http://www.otrs.org/TicketConnector/');
	

INSERT INTO `Filter` (`id`, `code`, `responce`, `question`, `node`, `askedBy_id`) VALUES
(19, NULL, NULL, 'In quale contesto stai operando?', 1, NULL),
(23, NULL, 'Tesoreria Centralizzata', 'Su quale di queste attività di ContPV stati operando?', 1, 19),
(24, NULL, 'Tesoreria Soc.Montebello', NULL, 0, 23),
(25, NULL, 'Tesoreria Soc.Orio', NULL, 0, 23),
(26, NULL, 'Contabilità di PDV', 'Su quale di queste attività di ContPV stati operando?', 1, 19),
(27, NULL, '01 Contabilita'' Iper Montebello', NULL, 0, 26),
(28, NULL, '02 Contabilita'' Iper Cremona', NULL, 0, 26),
(31, NULL, '03 Contabilita'' Iper Brembate', NULL, 0, 26),
(32, NULL, '04 Contabilita'' Iper Magenta', NULL, 0, 26),
(33, NULL, '05 Contabilita'' Iper Solbiate', NULL, 0, 26),
(34, NULL, '06 Contabilita'' Iper Varese', NULL, 0, 26),
(35, NULL, '07 Contabilita'' Iper Seriate', NULL, 0, 26),
(36, NULL, '08 Contabilita'' Iper Rozzano', NULL, 0, 26),
(37, NULL, '09 Contabilita'' Iper Rubicone', NULL, 0, 26),
(38, NULL, '10 Contabilita'' Iper Busnago', NULL, 0, 26),
(39, NULL, '10 Contabilita'' Iper Busnago', NULL, 0, 26),
(40, NULL, '12 Contabilita'' Iper Castelfranco', NULL, 0, 26),
(41, NULL, '14 Contabilita'' Iper Udine', NULL, 0, 26),
(42, NULL, '15 Contabilita'' Iper Tortona (MB)', NULL, 0, 26),
(43, NULL, '16 Contabilita'' Iper Pescara', NULL, 0, 26),
(44, NULL, '18 Contabilita'' Iper Orio', NULL, 0, 26),
(45, NULL, '19 Contabilita'' Iper Pesaro', NULL, 0, 26),
(46, NULL, '21 Contabilita'' Iper Grandate', NULL, 0, 26),
(47, NULL, '22 Contabilita'' Iper Colonnella', NULL, 0, 26),
(48, NULL, '23 Contabilita'' Iper Ortona', NULL, 0, 26),
(49, NULL, '24 Contabilita'' Iper Civitanova', NULL, 0, 26),
(50, NULL, '25 Contabilita'' Iper Serravalle (MB)', NULL, 0, 26),
(51, NULL, '26 Contabilita'' Iper Monza', NULL, 0, 26),
(52, NULL, '27 Contabilita'' Iper Portello', NULL, 0, 26),
(53, NULL, '28 Contabilita'' Iper Verona', NULL, 0, 26),
(54, NULL, '29 Contabilita'' Iper Lonato', NULL, 0, 26),
(55, NULL, '31 Contabilita'' Iper Vittuone', NULL, 0, 26),
(56, NULL, '60 Contabilita'' Iperama Cremona', NULL, 0, 26),
(57, NULL, '61 Contabilita'' Iperama Tortona', NULL, 0, 26),
(58, NULL, '65 Contabilita'' La grande I', NULL, 0, 26),
(59, NULL, 'Contabilità di Piattaforma', 'Su quale di queste attività di ContPV stati operando?', 1, 19),
(62, NULL, '80 Contabilita'' Piattaforma di Soresina', NULL, 0, 59),
(63, NULL, '93 Contabilita'' Ortofin', NULL, 0, 59),
(64, NULL, 'Gestione Affitti', 'Su quale di queste attività di ContPV stati operando?', 1, 19),
(65, NULL, 'Affitti 73-Auredia', NULL, 0, 64),
(66, NULL, 'Affitti 04-Iper Montebello', NULL, 0, 64),
(67, NULL, 'Affitti 71-Clivia', NULL, 0, 64),
(68, NULL, 'Affitti 74-Il Destriero', NULL, 0, 64),
(69, NULL, 'Cassa Centrale di PDV', 'Su quale di queste attività di ContPV stati operando?', 1, 19),
(70, NULL, 'Cassa Centrale Busnago', NULL, 0, 69),
(71, NULL, 'Cassa Centrale Civitanova', NULL, 0, 69),
(72, NULL, 'Cassa Centrale Colonnella', NULL, 0, 69),
(73, NULL, 'Cassa Centrale Cremona', NULL, 0, 69),
(74, NULL, 'Cassa Centrale Grandate', NULL, 0, 69),
(75, NULL, 'Cassa Centrale Iper Brembate', NULL, 0, 69),
(76, NULL, 'Cassa Centrale Iper Lonato', NULL, 0, 69),
(77, NULL, 'Cassa Centrale Magenta', NULL, 0, 69),
(78, NULL, 'Cassa Centrale Montebello', NULL, 0, 69),
(79, NULL, 'Cassa Centrale Monza', NULL, 0, 69),
(80, NULL, 'Cassa Centrale Orio', NULL, 0, 69),
(81, NULL, 'Cassa Centrale Ortona', NULL, 0, 69),
(82, NULL, 'Cassa Centrale Pesaro', NULL, 0, 69),
(83, NULL, 'Cassa Centrale Pescara', NULL, 0, 69),
(84, NULL, 'Cassa Centrale Portello', NULL, 0, 69),
(85, NULL, 'Cassa Centrale Pozzolo (MB)', NULL, 0, 69),
(86, NULL, 'Cassa Centrale Rozzano', NULL, 0, 69),
(87, NULL, 'Cassa Centrale Rubicone', NULL, 0, 69),
(88, NULL, 'Cassa Centrale Seriate', NULL, 0, 69),
(89, NULL, 'Cassa Centrale Serravalle (MB)', NULL, 0, 69),
(90, NULL, 'Cassa Centrale Solbiate', NULL, 0, 69),
(91, NULL, 'Cassa Centrale Tortona (MB)', NULL, 0, 69),
(92, NULL, 'Cassa Centrale Udine', NULL, 0, 69),
(93, NULL, 'Cassa Centrale Varese', NULL, 0, 69),
(94, NULL, 'Cassa Centrale Verona', NULL, 0, 69),
(95, NULL, 'Cassa Centrale Vittuone', NULL, 0, 69),
(96, NULL, 'Service Amministrazione', 'Su quale di queste attività di ContPV stati operando?', 1, 19),
(97, NULL, 'DA Finiper - Contabilità', NULL, 0, 96),
(98, NULL, 'DA IperMontebello - Contabilità', NULL, 0, 96),
(99, NULL, 'DA Orio - Contabilità', NULL, 0, 96),
(100, NULL, 'DA Ortofin - Contabilità', NULL, 0, 96),
(101, NULL, 'DA Unes - Contabilita''', NULL, 0, 96),
(102, NULL, 'DA Vera - Contabilità', NULL, 0, 96),
(103, NULL, 'Fatture Piattaforme', NULL, 0, 96),
(104, NULL, 'Reporting Finiper', NULL, 0, 96),
(105, NULL, 'Statistiche su cifra', NULL, 0, 96),
(106, NULL, 'Supervisione Contabilita''', NULL, 0, 96),
(107, NULL, NULL, 'Dove hai incontrato il tuo problema?', 1, NULL),
(108, NULL, 'Non riesco ad accedere', NULL, 0, 107),
(109, NULL, 'Non vedo tutti i miei reparti', NULL, 0, 107),
(110, NULL, 'Nella modifica formato cartelli automatici', 'Contattare il Marketing per questo tipo di richieste!', 0, 107),
(111, NULL, 'Nei piani automatici', 'Cosa è successo?', 1, 107),
(112, NULL, 'Manca una referenza', NULL, 0, 111),
(113, NULL, 'Referenza sbagliata', NULL, 0, 111),
(114, NULL, 'Cartello associato sbagliato', NULL, 0, 111),
(115, NULL, 'Nei piani manuali', 'Cosa è successo?', 1, 107),
(116, NULL, 'Non trovi la referenza', NULL, 0, 115),
(117, NULL, 'La referenza è in promo sbagliata', NULL, 0, 115),
(118, NULL, 'Non trovi il cartello da associare', NULL, 0, 115),
(119, NULL, 'Altro', NULL, 0, 115);

		
INSERT INTO `hd0`.`Queue` (`id`, `service_id`, `order`, `name`, `code`, `filter_id`)
	VALUES (NULL, '1', '0', 'EasyPOP', '5', 107);
		
INSERT INTO `hd0`.`Queue` (`id`, `service_id`, `order`, `name`, `code`, `filter_id`)
	VALUES	(NULL, '1', '1', 'ContPV', '3', 19);

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
