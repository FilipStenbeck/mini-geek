package se.stenbeck;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public abstract class BGGServlet extends HttpServlet {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 2021073197107391403L;


	public abstract void handleRequest(HttpServletRequest req, HttpServletResponse resp)
	throws IOException;
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		addHeders(resp);
		handleRequest(req, resp);
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) 	throws ServletException, IOException {
		addHeders(resp);
		handleRequest(req, resp);
	}
	
	@Override
	protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		addHeders(resp);
		super.doOptions(req, resp);
	}
	
	
	private void addHeders(HttpServletResponse resp) {
		resp.setContentType("application/json");
		resp.setCharacterEncoding("UTF-8");
		resp.addHeader("Access-Control-Allow-Origin", "*");
		resp.addHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
		resp.addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
	}


}
