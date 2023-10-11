INSERT INTO groups (id, description) values (1, 'Group 1');
INSERT INTO groups (id, description) values (2, 'Group 2');
INSERT INTO groups (description) values ('Group 3');

INSERT INTO terms (id, term, definition, "case", pos) values (1, 'logos', 'word', 0, 0);
INSERT INTO terms (id, term, definition, "case", pos) values (2, 'fusis', 'nature', 0, 0);
INSERT INTO terms (id, term, definition, "case", pos) values (3, 'thaumazo', 'admire, wonder at', 0, 1);
INSERT INTO terms (id, term, definition, "case", pos, pps) values (4, 'luo', 'loosen', 0, 0, '["luo", "luso", "elusa", "leluka", "lelumai", "eluthen"]');
INSERT INTO terms (term, definition, "case", pos) values ('dynamis', 'potency', 0, 0);
INSERT INTO terms (term, definition, "case", pos) values ('onoma', 'name', 0, 0);


INSERT into group_detail (term_id, group_id) values (1, 1);
INSERT into group_detail (term_id, group_id) values (2, 1);
INSERT into group_detail (term_id, group_id) values (3, 2);
INSERT into group_detail (term_id, group_id) values (4, 2);

