-- Table structure for table `usuario`
CREATE TABLE public.usuario (
usuario_id INT GENERATED BY DEFAULT AS IDENTITY,
usuario_nombre CHARACTER VARYING NOT NULL,
usuario_apellido CHARACTER VARYING NOT NULL,
usuario_email character varying NOT NULL,
usuario_password character varying NOT NULL,
CONSTRAINT usuario_pk PRIMARY KEY (usuario_id)
);

-- Table structure for table `evento`
CREATE TABLE IF NOT EXISTS public.evento
(
evento_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY, 
evento_nombre character varying NOT NULL, 
evento_lugar character varying NOT NULL,
evento_ciudad character varying NOT NULL,
evento_fecha DATE NOT NULL,
evento_hora TIME NOT NULL,
evento_descripcion text, 
evento_image character varying NOT NULL,
evento_tickets character varying NOT NULL,
usuario_id integer NOT NULL,
CONSTRAINT evento_pk PRIMARY KEY (evento_id)
);

-- Create relationship between `usuario` and `evento` tables
ALTER TABLE IF EXISTS public.evento
	ADD CONSTRAINT evento_usuario_fk FOREIGN KEY (usuario_id)
	REFERENCES public.usuario (usuario_id) MATCH SIMPLE
	ON UPDATE CASCADE
	ON DELETE CASCADE;

-- Data for table `usuario`

INSERT INTO public.usuario 
(usuario_nombre, usuario_apellido, usuario_email, usuario_password) 
VALUES 
('Jorge', 'Menjivar', 'jorge.menjivar@email.com', 'Anjunadeep1*');

-- Data for table `evento`

INSERT INTO public.evento 
(evento_nombre, evento_lugar, evento_ciudad, evento_fecha, evento_hora, evento_descripcion, evento_image, evento_tickets, usuario_id) 
VALUES 
('Anjunadeep Open Air Peru', 'Club Cultural', 'Lima', '2025-04-04', '16:00:00', 'Anjunadeep llega a Lima en Abril', '/images/flyers/openairperu.jpeg', 'https://anjunadeep.com/us/events/peru', 1);

INSERT INTO public.evento 
(evento_nombre, evento_lugar, evento_ciudad, evento_fecha, evento_hora, evento_descripcion, evento_image, evento_tickets, usuario_id) 
VALUES 
('Anjunadeep Open Air Chile', 'Parque Padre Hurtado', 'Santiago', '2025-04-05', '16:00:00', 'Anjunadeep llega a Santiago en Abril', '/images/flyers/openairchile.jpeg', 'https://anjunadeep.com/us/events/chile', 1)
