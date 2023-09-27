package com.indigoapp.smtp;

import java.util.Properties;
import java.net.InetAddress;
import java.util.Properties;
import java.util.Date;
import javax.activation.*;

import com.facebook.react.bridge.*;
import javax.mail.*;
import javax.mail.internet.*;
import javax.mail.util.ByteArrayDataSource;
import com.sun.mail.smtp.SMTPTransport;

public class ReceiptMail extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;

  public ReceiptMail(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @ReactMethod
  public void sendReceipt(String email, String encoded, Callback callback) {
    Properties props = System.getProperties();
    props.put("mail.smtps.host", "smtp.gmail.com");
    props.put("mail.smtps.auth", "true");
    Session session = Session.getInstance(props, null);
    Message msg = new MimeMessage(session);
    try {
      msg.setFrom(new InternetAddress("noreply@link2.co"));
      msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email, false));
      msg.setSubject("Receipt");

      BodyPart messageBodyPart = new MimeBodyPart();
      messageBodyPart.setText("Your receipt is attached");
      Multipart multipart = new MimeMultipart();
      multipart.addBodyPart(messageBodyPart);

      messageBodyPart = new PreencodedMimeBodyPart("base64");
      messageBodyPart.setText(encoded);
      messageBodyPart.setFileName("receipt.png");
      messageBodyPart.setHeader("Content-ID", "<image>");
      multipart.addBodyPart(messageBodyPart);

      msg.setContent(multipart);

      SMTPTransport transport = (SMTPTransport) session.getTransport("smtps");
      transport.connect("smtp.gmail.com", "thealexpanov@gmail.com", "lrfljqmkqkxwuupi");
      transport.sendMessage(msg, msg.getAllRecipients());
      transport.close();

      callback.invoke();
    } catch (Exception e) {
      callback.invoke(e.getMessage());
    }
  }

  @Override
  public String getName() {
    return "ReceiptMail";
  }
}
