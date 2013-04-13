package se.stenbeck;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class VideoList extends BGGServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public void handleRequest(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		PrintWriter out = null;
		try {
			String id = req.getParameter("id");	
			resp.setContentType("text/html");
			out = resp.getWriter();
			JSONObject obj = new JSONObject();
			JSONArray array = BggXmlApiUtil.getgameVideo(id);
			obj.put("result", array);
			out.write(obj.toString());
		} catch (JSONException e) {
			e.printStackTrace();
		} finally {
			if (out != null) {
				out.close();
			}
		}
	}

}
