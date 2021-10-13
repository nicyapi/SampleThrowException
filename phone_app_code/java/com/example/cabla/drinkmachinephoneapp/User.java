package com.example.cabla.drinkmachinephoneapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.support.design.widget.TabLayout;

import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;

import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;

import android.widget.TextView;
import android.widget.Toast;

import java.net.InetAddress;
import java.util.ArrayList;

public class User extends AppCompatActivity {
    ArrayList<String> status_package;
    ArrayList<String> inventory_package;
    ArrayList<String> sales_package;
    ArrayList<String> dates;
    String url = "";
    boolean noData = true;

    //String data_package;
    private SectionsPagerAdapter mSectionsPagerAdapter;

    // The {@link ViewPager} that will host the section contents.
    private ViewPager mViewPager;

    public static final String MYPREFERENCES = "prefs";
    SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user);
        prefs = getApplicationContext().getSharedPreferences(MYPREFERENCES, Context.MODE_PRIVATE);

        attemptDataTransfer();

        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        mSectionsPagerAdapter = new SectionsPagerAdapter(getSupportFragmentManager());

        // Set up the ViewPager with the sections adapter.
        mViewPager = (ViewPager) findViewById(R.id.container);
        mViewPager.setAdapter(mSectionsPagerAdapter);

        TabLayout tabLayout = (TabLayout) findViewById(R.id.tabs);

        mViewPager.addOnPageChangeListener(new TabLayout.TabLayoutOnPageChangeListener(tabLayout));
        tabLayout.addOnTabSelectedListener(new TabLayout.ViewPagerOnTabSelectedListener(mViewPager));
    }

    public void attemptDataTransfer(){
        url = prefs.getString("url","http://10.0.0.35:8000/shared_data_2018-11-22.txt");
        Log.i("CHRIS_TEST_pref",url);
        DataRequester request = new DataRequester(url);
        try{
            Log.i("CHRIS","TEST2");
            Thread t = new Thread(request);
            t.start();
            t.join();

            sales_package = request.getSalesData();
            inventory_package = request.getInventoryData();
            status_package = request.getStatusData();
            dates = request.getDates();
            noData = false;
        }
        catch (InterruptedException i){
            Log.i("CHRIS","TEST3");
            Log.d("ERROR","Thread issue");

        }

    }



    //This method is for attaching features to the menu icon
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_user, menu);
        return true;
    }


    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.ip_config) {
            Intent ip_config_screen = new Intent("com.example.cabla.drinkmachinephoneapp.IP_Config");
            startActivity(ip_config_screen);
            return true;
        }
        if(id == R.id.request_data){
            attemptDataTransfer();
            Toast.makeText(this,"Attempting to update data",
                    Toast.LENGTH_SHORT).show();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    /**
     * A placeholder fragment containing a simple view.
     */
    public static class PlaceholderFragment extends Fragment {
        /**
         * The fragment argument representing the section number for this
         * fragment.
         */
        private static final String ARG_SECTION_NUMBER = "section_number";

        public PlaceholderFragment() {
        }

        /**
         * Returns a new instance of this fragment for the given section
         * number.
         */
        public static PlaceholderFragment newInstance(int sectionNumber) {
            PlaceholderFragment fragment = new PlaceholderFragment();
            Bundle args = new Bundle();
            args.putInt(ARG_SECTION_NUMBER, sectionNumber);
            fragment.setArguments(args);
            return fragment;
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View rootView = inflater.inflate(R.layout.fragment_user, container, false);
            //TextView textView = (TextView) rootView.findViewById(R.id.section_label);
            //textView.setText(getString(R.string.section_format, getArguments().getInt(ARG_SECTION_NUMBER)));
            return rootView;
        }
    }

    /**
     * A {@link FragmentPagerAdapter} that returns a fragment corresponding to
     * one of the sections/tabs/pages.
     */
    public class SectionsPagerAdapter extends FragmentPagerAdapter {

        public SectionsPagerAdapter(FragmentManager fm) {
            super(fm);
        }

        @Override // getItem is called to instantiate the fragment for the given page.
        public Fragment getItem(int position) {
            Fragment cur_fragment = null;

            switch(position){
                case 0:
                    Bundle bundle_0 = new Bundle();
                    bundle_0.putStringArrayList("inventory",inventory_package);
                    bundle_0.putBoolean("no_data",noData);
                    cur_fragment = new InventoryFragment() ;
                    cur_fragment.setArguments(bundle_0);
                    break;
                case 1:
                    Bundle bundle_1 = new Bundle();
                    bundle_1.putStringArrayList("sales",sales_package);
                    bundle_1.putStringArrayList("dates",dates);
                    bundle_1.putBoolean("no_data",noData);

                    cur_fragment = new SalesFragment() ;
                    cur_fragment.setArguments(bundle_1);
                    break;
                case 2:
                    Bundle bundle_2 = new Bundle();
                    bundle_2.putStringArrayList("status",status_package);
                    bundle_2.putBoolean("no_data",noData);
                    cur_fragment = new StatusFragment();
                    cur_fragment.setArguments(bundle_2);
                    break;
                default:
                    //no match
            }

            return cur_fragment;
        }

        @Override
        public int getCount() {
            // Show 3 total pages.
            return 3;
        }
    }
}
