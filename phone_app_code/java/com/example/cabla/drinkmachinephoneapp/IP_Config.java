package com.example.cabla.drinkmachinephoneapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class IP_Config extends AppCompatActivity {
    TextView ip_entry;
    Button save;
    Button back;
    EditText new_url;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ip__config);
        final SharedPreferences prefs;
        save = findViewById(R.id.save);
        back = findViewById(R.id.back);
        new_url = findViewById(R.id.ip_entry);

        prefs = getApplicationContext().getSharedPreferences("prefs", Context.MODE_PRIVATE);
        ip_entry = findViewById(R.id.ip_entry);
        ip_entry.setText(prefs.getString("url","http://10.0.0.35:8000/shared_data_2018-11-22.txt"));

        final Intent previous = new Intent("com.example.cabla.drinkmachinephoneapp.User");

        save.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences.Editor editor = prefs.edit();
                editor.putString("url",new_url.getText().toString());
                editor.apply();
                startActivity(previous);
            }
        });

        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(previous);
            }
        });
    }
}
