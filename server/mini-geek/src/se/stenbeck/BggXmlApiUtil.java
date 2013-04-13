package se.stenbeck;

import java.io.InputStream;
import java.net.URL;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.json.JSONArray;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;



public final class BggXmlApiUtil {



	public static JSONArray getgameInfo(String id) {
		
		JSONArray array = new JSONArray();
		JSONObject gameInfo = new JSONObject();
		try {
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();
			
			URL url = new URL("http://www.boardgamegeek.com/xmlapi2/thing?id=" + id + "&stats=1");
			InputStream openStream = url.openStream();
			Document doc = db.parse(openStream);
			
			doc.getDocumentElement().normalize();
			String minPlayers = null;
			NodeList nodeLst = doc.getElementsByTagName("name");
			Node node = nodeLst.item(0);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				gameInfo.put("name",  node.getAttributes().getNamedItem("value").getNodeValue());
			}

			nodeLst = doc.getElementsByTagName("thumbnail");
			node = nodeLst.item(0);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				gameInfo.put("thumbnail", node.getFirstChild().getNodeValue());
			}
			
			nodeLst = doc.getElementsByTagName("yearpublished");
			node = nodeLst.item(0);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				gameInfo.put("yearpublished", node.getAttributes().getNamedItem("value").getNodeValue());
			}
			
			nodeLst = doc.getElementsByTagName("minplayers");
			node = nodeLst.item(0);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				minPlayers = node.getAttributes().getNamedItem("value").getNodeValue();
			}
			
			nodeLst = doc.getElementsByTagName("maxplayers");
			node = nodeLst.item(0);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				gameInfo.put("players", minPlayers + "-" + node.getAttributes().getNamedItem("value").getNodeValue());
			}
			
			nodeLst = doc.getElementsByTagName("average");
			node = nodeLst.item(0);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				gameInfo.put("rating", node.getAttributes().getNamedItem("value").getNodeValue());
			}
			
			nodeLst = doc.getElementsByTagName("description");
			node = nodeLst.item(0);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				gameInfo.put("description", node.getFirstChild().getNodeValue());
			}
			
			gameInfo.put("link", "<a href='http://boardgamegeek.com/boardgame/"+ id +"' target='_blank'>Link to bgg gamepage");
		} catch (Exception e) {
			e.printStackTrace();
		}
		array.put(gameInfo);
		return array;
	}
	
	public static JSONArray getgameVideo(String id) {
		JSONArray videos = new JSONArray();
		try {
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = dbf.newDocumentBuilder();
		URL url = new URL("http://www.boardgamegeek.com/xmlapi2/thing?id=" + id + "&videos=1");
		InputStream openStream = url.openStream();
		Document doc = db.parse(openStream);
		doc.getDocumentElement().normalize();
		NodeList nodeLst = doc.getElementsByTagName("videos");
		Node rootVideo = nodeLst.item(0);
		NodeList childNodes = rootVideo.getChildNodes();
		for (int s = 0; s < childNodes.getLength(); s++) {
			Node node = childNodes.item(s);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				JSONObject video = new JSONObject();
				String link = "<a href='"+ node.getAttributes().getNamedItem("link").getNodeValue() +"'>" + node.getAttributes().getNamedItem("title").getNodeValue();
				video.put("link", link);
				videos.put(video);
			}
		 }
		} catch (Exception e) {
			e.printStackTrace();
		}
		return videos;
	}
	
	
	public static JSONArray getCollection(String username) {
		JSONArray result = new JSONArray();
		try {
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();
			URL url = new URL("http://boardgamegeek.com/xmlapi2/collection?own=1&username="+username);
			InputStream openStream = url.openStream();
			Document doc = db.parse(openStream);
			doc.getDocumentElement().normalize();
			  NodeList nodeLst = doc.getElementsByTagName("item");
			  for (int s = 0; s < nodeLst.getLength(); s++) {
			    Node node = nodeLst.item(s);
			    JSONObject obj = new JSONObject();
			    if (node.getNodeType() == Node.ELEMENT_NODE) {
			    	NamedNodeMap attributes = node.getAttributes();	
			    	obj.put("id", attributes.getNamedItem("objectid").getNodeValue());	
			    	Element element = (Element) node;
				    NodeList nameLst = element.getElementsByTagName("name");
				    Element nameElmnt = (Element) nameLst.item(0);
				    NodeList nameNideList = nameElmnt.getChildNodes();
				    obj.put("name",((Node) nameNideList.item(0)).getNodeValue());
			    }
			    result.put(obj);
			  }
		} catch (Exception e) {
			e.printStackTrace();
		} 
		return result;
	}
	
	
	public static JSONArray search(String query) {
		JSONArray result = new JSONArray();
		
		try {
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();
			
			//URL url = new URL("http://boardgamegeek.com/xmlapi/search?search=" + "Race%20for%20the%20galaxy");
			URL url = new URL("http://boardgamegeek.com/xmlapi/search?search=" + query);
			InputStream openStream = url.openStream();
			Document doc = db.parse(openStream);
			
			doc.getDocumentElement().normalize();
			NodeList nodeLst = doc.getElementsByTagName("boardgame");
			for (int s = 0; s < nodeLst.getLength(); s++) {
				Node node = nodeLst.item(s);
				if (node.getNodeType() == Node.ELEMENT_NODE) {
					NamedNodeMap attributes = node.getAttributes();
					JSONObject obj = new JSONObject();
					obj.put("id", attributes.getNamedItem("objectid").getNodeValue());
					NodeList childNodes = node.getChildNodes();
					for (int i = 0; i < childNodes.getLength(); i++) {

						if (node.getNodeType() == Node.ELEMENT_NODE) {
							Element element = (Element) node;
							NodeList nameLst = element
									.getElementsByTagName("name");
							Element nameElmnt = (Element) nameLst.item(0);
							NodeList nameNideList = nameElmnt.getChildNodes();
							obj.put("name", ((Node) nameNideList.item(0))
									.getNodeValue());
						}
					}
					result.put(obj);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	public static JSONArray getForumList(String gameid) {
		JSONArray result = new JSONArray();
		//Get thread list
		try {
			  DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			  DocumentBuilder db = dbf.newDocumentBuilder();
			  URL url = new URL("http://boardgamegeek.com/xmlapi2/forumlist?type=thing&id="+gameid);
			  InputStream openStream = url.openStream();
			Document doc = db.parse(openStream);
			  doc.getDocumentElement().normalize();
			  NodeList nodeLst = doc.getElementsByTagName("forum");
			  for (int s = 0; s < nodeLst.getLength(); s++) {
			    Node node = nodeLst.item(s);
			    if (node.getNodeType() == Node.ELEMENT_NODE) {
			    	JSONObject obj = new JSONObject();
			    	NamedNodeMap attributes = node.getAttributes();
			    	obj.put("title", attributes.getNamedItem("title").getNodeValue()); 
			    	obj.put("id", node.getNodeName() + "#" + attributes.getNamedItem("id").getNodeValue());
			    	obj.put("leaf",false);
			    	
			    	result.put(obj);
			    }
			  }
		} catch (Exception e) {
			e.printStackTrace();
		} 
		return result;
	}
	
	public static JSONArray getThreadInForum(String forumId) {
		JSONArray result = new JSONArray();
		try {
			  DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			  DocumentBuilder db = dbf.newDocumentBuilder();
			  URL url = new URL("http://boardgamegeek.com/xmlapi2/forum?id=" + forumId +"&page=1");
			  InputStream openStream = url.openStream();
			  Document doc = db.parse(openStream);
			  doc.getDocumentElement().normalize();
			  NodeList nodeLst = doc.getElementsByTagName("thread");
			  for (int s = 0; s < nodeLst.getLength(); s++) {
			    Node node = nodeLst.item(s);
			    if (node.getNodeType() == Node.ELEMENT_NODE) {
			    	JSONObject obj = new JSONObject();
			    	NamedNodeMap attributes = node.getAttributes();
			    	obj.put("id",node.getNodeName() + "#" + attributes.getNamedItem("id").getNodeValue());
			    	obj.put("title",attributes.getNamedItem("subject").getNodeValue());
			    	obj.put("leaf",false);
			    	result.put(obj);
			    }
			  }
		} catch (Exception e) {
			e.printStackTrace();
		} 
		return result; 
	}
	
	public static JSONArray getPosts(String threadId) {
		JSONArray result = new JSONArray();
		try {
			  DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			  DocumentBuilder db = dbf.newDocumentBuilder();
			  URL url = new URL("http://boardgamegeek.com/xmlapi2/thread?id="+ threadId);
			  InputStream openStream = url.openStream();
			  Document doc = db.parse(openStream);
			  doc.getDocumentElement().normalize();
			  NodeList nodeLst = doc.getElementsByTagName("body");
			  for (int s = 0; s < nodeLst.getLength(); s++) {
				  Node node = nodeLst.item(s);
				  JSONObject obj = new JSONObject();
				  obj.put("id",Integer.toString(s));
				  obj.put("title", node.getFirstChild().getNodeValue());
				  obj.put("leaf",true);
				  result.put(obj);
			  }
		} catch (Exception e) {
			e.printStackTrace();
		} 
		return result; 
	}
	
	public static JSONArray getPostsWithUser(String threadId) {
		JSONArray result = new JSONArray();
		try {
			//Put a link to bgg thread at the top
			JSONObject header = new JSONObject();
			header.put("title", "<a href='http://boardgamegeek.com/thread/"+ threadId +"' target='_blank'> Open thread on BoardGameGeek</a>");
			header.put("leaf", true);
			result.put(header);
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();
			URL url = new URL("http://boardgamegeek.com/xmlapi2/thread?id="
					+ threadId);
			InputStream openStream = url.openStream();
			Document doc = db.parse(openStream);
			doc.getDocumentElement().normalize();
			NodeList nodeLst = doc.getElementsByTagName("article");
			for (int s = 0; s < nodeLst.getLength(); s++) {
				Node node = nodeLst.item(s);
				NamedNodeMap attributes = node.getAttributes();
				JSONObject obj = new JSONObject();
				obj.put("id", Integer.toString(s));
				NodeList nodeLstBody = doc.getElementsByTagName("body");
				Node nodeBody = nodeLstBody.item(s);
				String author = attributes.getNamedItem("username")
						.getNodeValue();
				String date = attributes.getNamedItem("postdate")
						.getNodeValue().substring(0, 10);
				obj.put("title", "<font color=#2121A4> Author:" + author
						+ " : " + date + "</font><BR>"
						+ nodeBody.getFirstChild().getNodeValue());
				obj.put("leaf", true);
				result.put(obj);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	

	public static JSONArray getHotGames() {
		JSONArray result = new JSONArray();
		try {
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();
			URL url = new URL("http://boardgamegeek.com/xmlapi2/hot?listtype=boardgame");
			InputStream openStream = url.openStream();
			Document doc = db.parse(openStream);
			doc.getDocumentElement().normalize();
			NodeList nodeLst = doc.getElementsByTagName("item");
			for (int s = 0; s < nodeLst.getLength(); s++) {
				Node node = nodeLst.item(s);
				if (node.getNodeType() == Node.ELEMENT_NODE) {
					NamedNodeMap attributes = node.getAttributes();
					JSONObject obj = new JSONObject();
					obj.put("id", attributes.getNamedItem("id").getNodeValue());
					NodeList childNodes = node.getChildNodes();
					for (int i = 0; i < childNodes.getLength(); i++) {
						Node nameNode = childNodes.item(i);
						if (nameNode.getNodeType() == Node.ELEMENT_NODE && nameNode.getNodeName().equals("name")) {
							NamedNodeMap attributes2 = nameNode.getAttributes();
							obj.put("name", attributes2.getNamedItem("value").getNodeValue());
						}
					}
					result.put(obj);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	public static String getThumbnail(String id) {
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db;
		try {
			db = dbf.newDocumentBuilder();
			URL url = new URL("http://www.boardgamegeek.com/xmlapi2/thing?id=" + id + "&stats=1");
			InputStream openStream = url.openStream();
			Document doc = db.parse(openStream);
			
			NodeList nodeLst = doc.getElementsByTagName("thumbnail");
			Node node = nodeLst.item(0);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				return node.getFirstChild().getNodeValue();
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";
	}
}
