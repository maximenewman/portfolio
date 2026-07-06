CREATE TABLE "experience_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experience_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"type" text DEFAULT 'tech' NOT NULL,
	"role" text NOT NULL,
	"company" text NOT NULL,
	"date" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"headline" text DEFAULT '' NOT NULL,
	"overview" text,
	"hero_image" text,
	"projects" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"highlights" text[] DEFAULT '{}' NOT NULL,
	"skills" text[] DEFAULT '{}' NOT NULL,
	"visibility" text DEFAULT 'draft' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "experiences_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "experience_assets" ADD CONSTRAINT "experience_assets_experience_id_experiences_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience_assets" ADD CONSTRAINT "experience_assets_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "experience_assets_experience_idx" ON "experience_assets" USING btree ("experience_id");--> statement-breakpoint
CREATE INDEX "experiences_visibility_idx" ON "experiences" USING btree ("visibility","position");--> statement-breakpoint
CREATE INDEX "experiences_slug_idx" ON "experiences" USING btree ("slug");