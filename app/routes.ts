import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	layout("./layouts/main.tsx", [
		index("routes/home.tsx"),
		route("polls/create", "routes/polls/create.tsx")
		// route("polls", "routes/polls/page.tsx", [ ])
	])
] satisfies RouteConfig;
