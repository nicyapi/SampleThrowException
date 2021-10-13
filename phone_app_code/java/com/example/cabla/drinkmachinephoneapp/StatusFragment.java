package com.example.cabla.drinkmachinephoneapp;


import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.ArrayList;

/**
 * A simple {@link Fragment} subclass.
 */
public class StatusFragment extends Fragment {


    public StatusFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view_frag = inflater.inflate(R.layout.fragment_status2, container, false);
        TextView mode_var = view_frag.findViewById(R.id.mode_variable);
        TextView status_var = view_frag.findViewById(R.id.status_variable);
        TextView cur_user_var = view_frag.findViewById(R.id.cur_user_variable);

        ArrayList<String> status_info = getArguments().getStringArrayList("status");
        boolean no_status_data  = getArguments().getBoolean("no_data") ;

        if(!no_status_data) {
            status_var.setText(status_info.get(0));
            mode_var.setText(status_info.get(1));
            cur_user_var.setText(status_info.get(2));
        }
        else{
            status_var.setText("Dummy Data");
        }

        return view_frag;
    }

}
