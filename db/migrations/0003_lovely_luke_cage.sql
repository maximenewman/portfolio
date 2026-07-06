CREATE TABLE "passion_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"passion_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "passions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"icon" text DEFAULT 'code' NOT NULL,
	"details" text[] DEFAULT '{}' NOT NULL,
	"media_links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"images" text[] DEFAULT '{}' NOT NULL,
	"image_alts" text[] DEFAULT '{}' NOT NULL,
	"video_embed" text,
	"timeline" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"image_position" text DEFAULT 'center' NOT NULL,
	"visibility" text DEFAULT 'draft' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "passions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "passion_assets" ADD CONSTRAINT "passion_assets_passion_id_passions_id_fk" FOREIGN KEY ("passion_id") REFERENCES "public"."passions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passion_assets" ADD CONSTRAINT "passion_assets_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "passion_assets_passion_idx" ON "passion_assets" USING btree ("passion_id");--> statement-breakpoint
CREATE INDEX "passions_visibility_idx" ON "passions" USING btree ("visibility","position");