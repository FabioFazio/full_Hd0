<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/** @ORM\Entity */

class User {

    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255, nullable=true) */
	protected $name;
	
	/** @ORM\Column(type="string", length=255, unique=true) */
	protected $email;
	
	/** @ORM\Column(type="string", length=25, nullable=true) */
	protected $password;
	
	/** @ORM\Column(type="string", length=255, unique=true) */
	protected $username;
	
	/** @ORM\ManyToMany(targetEntity="Group") */
	protected $groups;

	/** @ORM\Column(type="boolean", nullable=true) */
	protected $administrator;
	
	/** @ORM\ManyToMany(targetEntity="Ticket") */
	protected $tracks;
	
	/** @ORM\Column(type="boolean") */
	protected $disabled;
	
	/** @ORM\OneToMany(targetEntity="Store", mappedBy="manager") */
	protected $chefStos;
	
	/** @ORM\OneToMany(targetEntity="Department", mappedBy="manager") */
	protected $chefDeps;
	
	/** @ORM\OneToMany(targetEntity="Sector", mappedBy="manager") */
	protected $chefSecs;
	
	public function __construct(){
		$this->groups = new ArrayCollection();
		$this->tracks = new ArrayCollection();
		$this->disabled = false;
	}
	
	public function getId(){
	    return $this->id;
	}

    public function setId($id){
        $this->id = $id;
    }
    
    public function getEmail(){
    	return $this->email;
    }
    
    public function setEmail($email){
    	$this->email = $email;
    }

    public function getUsername(){
    	return $this->username;
    }
    
    public function setUsername($username){
    	$this->username = $username;
    }

    public function getName(){
    	return $this->name;
    }
    
    public function setName($name){
    	$this->name = $name;
    }
    
    public function getPassword(){
    	return $this->password;
    }
    public function setPassword($password){
    	$this->password = $password;
    }
    
    public function getGroups(){
        return $this->groups;
    }
    
    public function setGroups($groups){
    	$this->groups = $groups;
    }
    
    public function getTracks(){
    	return $this->tracks;
    }
    
    public function setTracks($tracks){
    	$this->tracks = $tracks;
    }
    
    public function isAdministrator(){
    	return $this->administrator?:false;
    }
    
    public function setAdministrator($administrator){
    	$this->administrator = $administrator;
    }
    
    public function isDisabled(){
    	return $this->disabled?:false;
    }
    
    public function setDisabled($disabled){
    	$this->disabled = $disabled;
    }
    
    public function getChefStos(){
    	return $this->chefStos;
    }
    
    public function setChefStos($chefStos){
    	$this->chefStos = $chefStos;
    }
    
    public function getChefDeps(){
    	return $this->chefDeps;
    }
    
    public function setChefDeps($chefDeps){
    	$this->chefDeps = $chefDeps;
    }
    
    public function getChefSecs(){
    	return $this->chefSecs;
    }
    
    public function setChefSecs($chefSecs){
    	$this->chefSecs = $chefSecs;
    }
    
    public function getFullname(){
        $email = ($this->getEmail()==$this->getUsername())?"---":$this->getEmail();
        return $this->getName() . " <$email>";
    }
    
    public function getQueues($redundancy = false)
    {
        if(!isset($this->queues))
        {
            $gs = $this->getGroups()->toArray();
            $fps = []; $qs = []; $queues = [];
            foreach($gs as $g){
            	foreach($g->getGrants()->toArray() as $gr){
            		$fp = $gr->isFocalPoint();
            		foreach($gr->getQueues()->toArray() as $q){
            		    $q = $q->toArray();
            			if ($fp && !in_array($q, $fps)){
            				$fps[] = $q;
            			}
            			else if(!$fp && !in_array($q, $qs)){
            				$qs[] = $q;
            			}
            		}
            	}
            }
    		if ($redundancy)
    		{
    		    array_walk($fps, function(&$v){$v = $v + ['focalpoint'=>1];});
    		    array_walk($qs, function(&$v){$v = $v + ['focalpoint'=>0];});
    		    $queues = array_merge($qs, $fps);
    		}else{
        		foreach($qs as $q){
        			$fi = array_search($q, $fps);
        			if ($fi===false){
        				$queues[$q['id']] = $q + ['focalpoint'=>0];
        			}else{
        				$queues[$q['id']] = $q + ['focalpoint'=>1];
        				unset($fps[$fi]);
        			}
        		}
        		foreach($fps as $fp){
        			$queues[$fp['id']] = $fp + ['focalpoint'=>1];
        		}
    		}
            $this->queues = array_values($queues);
        }
        return $this->queues;
    }
    
    public function getSectors()
    {
    	if(!isset($this->sectors))
    	{
    		$ss = [];
    		foreach($this->getGroups()->toArray() as $g)
    		{
    		    if ($s = $g->getSector()){
        		    $ss[$s->getId()] = $s;
    		    }
    		}
    		$this->sectors = array_values($ss);
    	}
    	return $this->sectors;
    }
    
    public function toArray()
    {
    	$array = get_object_vars($this);
    
    	foreach (['groups', 'chefStos','chefDeps','chefSecs', 'tracks']
    	        as $property)
    	{
    	    $list = []; $method = 'get'.ucfirst($property);
    	    foreach($this->$method()->toArray() as $item){
    	    	$list[] = $item->getId();
    	    }
    	    unset($array[$property]);
    	    $array[$property.'_id'] = $list;
    	}
    	
    	$array['fullname'] = $this->getFullname();
    
    	return $array;
    }
}
