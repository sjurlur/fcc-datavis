--
-- PostgreSQL database dump
--

-- Dumped from database version 12.17 (Ubuntu 12.17-1.pgdg22.04+1)
-- Dumped by pg_dump version 12.17 (Ubuntu 12.17-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(22),
    games_played integer DEFAULT 0,
    best_game integer
);


ALTER TABLE public.users OWNER TO freecodecamp;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO freecodecamp;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.users VALUES (2, 'hei', 0, 0);
INSERT INTO public.users VALUES (3, 'ee', 0, 0);
INSERT INTO public.users VALUES (4, 'user_1724070187452', 0, 0);
INSERT INTO public.users VALUES (5, 'user_1724070187451', 0, 0);
INSERT INTO public.users VALUES (6, 'cobra', 0, 0);
INSERT INTO public.users VALUES (7, 'user_1724070305264', 0, 0);
INSERT INTO public.users VALUES (8, 'user_1724070305263', 0, 0);
INSERT INTO public.users VALUES (1, 'SDF', 0, 2);
INSERT INTO public.users VALUES (9, 'sjur', 1, 0);
INSERT INTO public.users VALUES (10, 'asdfsadf', 0, NULL);
INSERT INTO public.users VALUES (12, '99', 2, 1);
INSERT INTO public.users VALUES (11, '1234', 1, 3);
INSERT INTO public.users VALUES (14, 'user_1724071635180', 2, 157);
INSERT INTO public.users VALUES (13, 'user_1724071635181', 5, 24);
INSERT INTO public.users VALUES (15, 'kgkgk', 0, NULL);
INSERT INTO public.users VALUES (16, 'kjd', 0, NULL);
INSERT INTO public.users VALUES (17, 'sdf', 0, NULL);
INSERT INTO public.users VALUES (19, 'user_1724071719755', 2, 149);
INSERT INTO public.users VALUES (18, 'user_1724071719756', 5, 124);
INSERT INTO public.users VALUES (20, 'rr', 0, NULL);
INSERT INTO public.users VALUES (22, 'user_1724071772532', 2, 663);
INSERT INTO public.users VALUES (21, 'user_1724071772533', 5, 232);
INSERT INTO public.users VALUES (24, 'user_1724071821667', 2, 348);
INSERT INTO public.users VALUES (23, 'user_1724071821668', 5, 3);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.users_user_id_seq', 24, true);


--
-- Name: users users_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_name_key UNIQUE (name);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- PostgreSQL database dump complete
--

