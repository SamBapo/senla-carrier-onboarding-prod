CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: handle_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: carriers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carriers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    company_name text NOT NULL,
    contact_person text NOT NULL,
    contact_role text NOT NULL,
    zalo_number text NOT NULL,
    email text NOT NULL,
    company_address text NOT NULL,
    base_location text NOT NULL,
    number_of_trucks integer NOT NULL,
    tax_code text,
    business_registration_url text,
    truck_registration_urls text[],
    comments text,
    preferred_routes text[],
    preferred_load_types text[],
    additional_services text[],
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: trucks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trucks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    carrier_id uuid NOT NULL,
    truck_type text NOT NULL,
    load_capacity numeric NOT NULL,
    license_plate text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: carriers carriers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carriers
    ADD CONSTRAINT carriers_pkey PRIMARY KEY (id);


--
-- Name: trucks trucks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trucks
    ADD CONSTRAINT trucks_pkey PRIMARY KEY (id);


--
-- Name: carriers update_carriers_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_carriers_updated_at BEFORE UPDATE ON public.carriers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: trucks update_trucks_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_trucks_updated_at BEFORE UPDATE ON public.trucks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: carriers carriers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carriers
    ADD CONSTRAINT carriers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: trucks trucks_carrier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trucks
    ADD CONSTRAINT trucks_carrier_id_fkey FOREIGN KEY (carrier_id) REFERENCES public.carriers(id) ON DELETE CASCADE;


--
-- Name: carriers Users can create their own carrier profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own carrier profile" ON public.carriers FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: trucks Users can create their own trucks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own trucks" ON public.trucks FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.carriers
  WHERE ((carriers.id = trucks.carrier_id) AND (carriers.user_id = auth.uid())))));


--
-- Name: carriers Users can update their own carrier profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own carrier profile" ON public.carriers FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: trucks Users can update their own trucks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own trucks" ON public.trucks FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.carriers
  WHERE ((carriers.id = trucks.carrier_id) AND (carriers.user_id = auth.uid())))));


--
-- Name: carriers Users can view their own carrier profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own carrier profile" ON public.carriers FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: trucks Users can view their own trucks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own trucks" ON public.trucks FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.carriers
  WHERE ((carriers.id = trucks.carrier_id) AND (carriers.user_id = auth.uid())))));


--
-- Name: carriers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.carriers ENABLE ROW LEVEL SECURITY;

--
-- Name: trucks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


